import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const openspecRoot = path.join(repoRoot, "openspec")
const specsRoot = path.join(openspecRoot, "specs")
const errors = []

function walkMarkdownFiles(dir) {
  const files = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath)
    }
  }

  return files
}

function recordError(filePath, message) {
  errors.push(`${path.relative(repoRoot, filePath)}: ${message}`)
}

function validateMarkdownLinks(filePath, contents) {
  const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g

  for (const match of contents.matchAll(markdownLinkPattern)) {
    const target = match[1].trim()

    if (
      !target ||
      target.startsWith("#") ||
      /^[a-z]+:/i.test(target)
    ) {
      continue
    }

    if (target.startsWith("/")) {
      recordError(filePath, `uses a non-portable absolute link target: ${target}`)
      continue
    }

    const [relativeTarget] = target.split("#", 1)
    if (!relativeTarget) {
      continue
    }

    const resolvedTarget = path.resolve(path.dirname(filePath), relativeTarget)
    if (!fs.existsSync(resolvedTarget)) {
      recordError(filePath, `links to a missing file: ${target}`)
    }
  }
}

function validateSpecFile(specPath) {
  const lines = fs.readFileSync(specPath, "utf8").split(/\r?\n/)
  const requirements = []

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^##\s+Requirement:\s+(.+)$/)
    if (match) {
      requirements.push({ title: match[1].trim(), start: index })
    }
  }

  if (requirements.length === 0) {
    recordError(specPath, "must contain at least one requirement heading")
    return
  }

  const seenTitles = new Set()

  for (let index = 0; index < requirements.length; index += 1) {
    const requirement = requirements[index]
    const end = index + 1 < requirements.length ? requirements[index + 1].start : lines.length
    const block = lines.slice(requirement.start + 1, end)
    const firstContentLine = block.find((line) => line.trim() !== "")
    const scenarioIndexes = []

    if (seenTitles.has(requirement.title)) {
      recordError(specPath, `duplicates requirement title "${requirement.title}"`)
    }
    seenTitles.add(requirement.title)

    if (!firstContentLine || !/\b(SHALL|MUST)\b/.test(firstContentLine)) {
      recordError(specPath, `requirement "${requirement.title}" must start with a normative SHALL or MUST statement`)
    }

    for (let blockIndex = 0; blockIndex < block.length; blockIndex += 1) {
      if (/^####\s+Scenario:\s+.+$/.test(block[blockIndex])) {
        scenarioIndexes.push(blockIndex)
      }
    }

    if (scenarioIndexes.length === 0) {
      recordError(specPath, `requirement "${requirement.title}" must include at least one scenario`)
      continue
    }

    for (let scenarioIndex = 0; scenarioIndex < scenarioIndexes.length; scenarioIndex += 1) {
      const start = scenarioIndexes[scenarioIndex]
      const end = scenarioIndex + 1 < scenarioIndexes.length ? scenarioIndexes[scenarioIndex + 1] : block.length
      const scenarioBlock = block.slice(start + 1, end)

      const hasGiven = scenarioBlock.some((line) => /^- GIVEN /.test(line))
      const hasWhen = scenarioBlock.some((line) => /^- WHEN /.test(line))
      const hasThen = scenarioBlock.some((line) => /^- THEN /.test(line))

      if (!hasGiven || !hasWhen || !hasThen) {
        recordError(
          specPath,
          `scenario "${block[start].replace(/^####\s+Scenario:\s+/, "")}" must include GIVEN, WHEN, and THEN steps`,
        )
      }
    }
  }
}

if (!fs.existsSync(specsRoot)) {
  console.error("Missing openspec/specs directory")
  process.exit(1)
}

for (const entry of fs.readdirSync(specsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue
  }

  const capabilitySpec = path.join(specsRoot, entry.name, "spec.md")
  if (!fs.existsSync(capabilitySpec)) {
    recordError(capabilitySpec, "missing canonical spec.md")
    continue
  }

  validateSpecFile(capabilitySpec)
}

for (const markdownFile of walkMarkdownFiles(openspecRoot)) {
  const contents = fs.readFileSync(markdownFile, "utf8")
  validateMarkdownLinks(markdownFile, contents)
}

if (errors.length > 0) {
  console.error("OpenSpec validation failed:")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log("OpenSpec validation passed.")
