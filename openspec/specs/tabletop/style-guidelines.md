# Tabletop Style Guidelines

## Overview

This document defines the intended visual language for the tabletop shell and editing workflows.

The target style is ultra-compact, tool-dense, and utilitarian. The design reference is closer to:

- Dear ImGui and ImGui-style editors
- lil-gui
- tool-dense creative software such as Photoshop and similar editor surfaces

The goal is not to imitate those products literally. The goal is to preserve their strengths:

- high information density
- low chrome overhead
- fast scanning of controls and values
- minimal wasted padding
- clear panel boundaries
- compact, stable controls suited to extended editing sessions

## Primary Principles

### Density First

The shell should prefer compact controls and narrow panel chrome over spacious consumer-web layouts.

Default styling should assume users are working in panels full of:

- properties
- toggles
- numeric inputs
- layer lists
- asset lists
- entity summaries
- inspector sections

### Function Before Atmosphere

Editing and inspection surfaces should feel closer to an authoring tool than to a marketing site or narrative landing page.

Decorative spacing, oversized headings, and dramatic empty space should be avoided in editing contexts.

### Stable Spatial Rhythm

Compact does not mean visually chaotic. The system should use a tight but consistent spacing rhythm so repeated controls align cleanly and can be scanned quickly.

### Hierarchy Through Contrast, Not Size Inflation

Important controls should stand out through weight, tone, border treatment, active state, and grouping rather than by dramatically increasing padding or font size.

## Density Targets

The default shell density should be biased toward compact and dense operation.

Recommended baseline targets:

- panel headers should be short and low-height
- row heights should favor compact single-line presentation
- stacked controls should use minimal vertical gaps
- cards and sections should avoid large internal padding
- docks should fit multiple tools without immediately collapsing into scrolling

The platform may expose density preferences later, but the default target should be the compact end of the range.

## Typography

Typography should support dense editing rather than editorial reading.

Guidelines:

- default UI text should be small
- secondary metadata should be smaller still, but remain legible
- headings should be restrained and only slightly larger than body text
- long inspector panes should avoid oversized section titles
- labels should be concise and aligned for scanning
- monospaced text may be used selectively for numbers, IDs, coordinates, dice formulas, or technical fields

Typography should feel more like a professional tool panel than a document reader.

## Spacing and Padding

Spacing should be intentionally tight.

Guidelines:

- panel padding should be minimal
- nested panels should avoid compound padding that creates large dead margins
- list rows should use compact vertical spacing
- form groups should use small gaps between label, control, and help text
- section spacing should separate groups clearly without creating large open bands
- toolbars should use tight control spacing and compact hit areas consistent with dense desktop tools

Avoid large-card styling, oversized gutters, and broad empty margins in docks and inspectors.

## Panels and Chrome

Panel design should emphasize clarity and containment.

Guidelines:

- use crisp boundaries between regions and sections
- keep shadows subtle; rely more on borders, contrast, and separators than large soft elevation
- keep panel headers compact and utilitarian
- use separators freely to break dense tools into scan-friendly groups
- treat docks as tool containers, not as spacious content canvases

The shell should feel engineered and deliberate rather than soft or lounge-like.

## Controls

Controls should favor compact, repeatable interaction patterns.

Guidelines:

- buttons should be short and compact by default
- icon buttons should be small and aligned to a stable grid
- toggles, tabs, and segmented controls should read as tool controls rather than promotional pills
- numeric and text inputs should fit dense inspector usage
- dropdowns and menus should prefer concise rows and tight item spacing
- tree views and layer lists should support compact nesting without excessive indentation

Interactive affordances must stay clear, but should not expand into consumer-app proportions.

## Inspectors and Editors

Inspectors should optimize for fast scanning and rapid editing.

Guidelines:

- summary fields should appear near the top with minimal chrome
- editable values should align in dense vertical stacks
- repeated property groups should use clear separators and restrained headings
- tabs should be compact and preserve context when selection changes
- quick actions should fit inline or in short tool rows where possible

This is especially important for the right dock, where users may inspect many entities in sequence.

## Lists, Trees, and Tables

Dense information surfaces should preserve readability through alignment and restraint.

Guidelines:

- favor single-line rows unless expansion is necessary
- align columns and metadata for rapid scanning
- use subdued metadata styling rather than extra spacing
- expose selection, hover, and active states clearly
- keep indentation shallow and disciplined in tree structures

## Color and Tone

The system should use a restrained, tool-like palette for the base shell.

Guidelines:

- neutral surfaces should dominate
- accent colors should communicate interaction or mode, not decorate empty space
- warnings, errors, and status states should be high clarity and high contrast
- selected and focused states should be obvious without requiring heavy glow effects

System modules may add theme overlays, but the base shell should remain readable, workmanlike, and dense.

## Motion

Motion should be minimal and functional.

Guidelines:

- prefer short, efficient transitions
- avoid theatrical panel motion
- use animation primarily for clarity of state change, docking, expansion, and drag feedback
- drag interactions should prioritize precision and drop-target clarity over flourish

## 3D Scene Aesthetic

3D scene rendering should follow a deliberately stylized low-fidelity aesthetic rather than aiming for modern realism.

Primary reference points:

- PlayStation-era low-poly rendering
- classic RuneScape-style game-space readability
- retro 3D scenes with strong silhouettes and simple material treatment

The target is not strict nostalgia simulation. The goal is a readable, lightweight, intentionally constrained 3D look that feels game-like, authored, and slightly synthetic.

### Core 3D Principles

- favor low-poly silhouettes over dense geometric detail
- prioritize readable forms at tabletop zoom levels
- use simple, intentionally limited material response
- prefer stylized scene clarity over realism, physically rich shading, or cinematic mood
- keep rendering lightweight enough that many interactive scene elements can coexist without visual clutter

### Geometry

Guidelines:

- models should read clearly from medium and distant camera positions
- silhouettes should carry most of the visual identity
- micro-detail should be avoided unless it survives tabletop viewing distance
- props, tiles, and scene dressing should prefer blocky, readable forms

### Materials and Textures

Guidelines:

- prefer flat, simple, or lightly shaded materials
- texture work should be low-resolution or intentionally restrained in detail density
- avoid noisy surface detail that blurs at gameplay distance
- embrace limited texture precision and stylized sharpness where it helps the retro aesthetic
- material variation should come from hue, value, and silhouette more than complex reflectance

### Lighting

Guidelines:

- lighting should be clear and game-readable rather than cinematic
- use lighting to separate walkable space, objects, and points of interaction
- avoid heavy global illumination styling, filmic bloom, or realistic surface response as the default look
- shadows should support spatial comprehension, not visual spectacle

### Post-Processing

Post-processing should be restrained and in service of the low-fidelity aesthetic.

Guidelines:

- prefer minimal post-processing by default
- allow selective use of pixelation, affine-like instability, fog, color quantization, dithering, or similar retro cues only when they improve the intended look
- avoid modern glossy pipelines dominated by depth of field, lens artifacts, aggressive bloom, or high-end cinematic grading

### Color in 3D Space

Guidelines:

- use clear palette separation between ground, props, tokens, and interactive objects
- prefer slightly exaggerated readability over naturalistic color behavior
- reserve intense color accents for gameplay-significant objects, hazards, objectives, or selection states

### What To Avoid In 3D

Avoid the following as the default rendering direction:

- realistic PBR-heavy environments
- high-frequency material noise
- ultra-dense meshes that only read up close
- cinematic lighting pipelines designed for screenshots rather than play
- heavily processed fantasy realism that fights tabletop legibility
- visual complexity that makes tokens, paths, or interactables harder to identify

## What To Avoid

Avoid the following patterns in shell, inspector, and editor surfaces:

- oversized cards with large internal padding
- spacious dashboard styling
- marketing-site hero proportions
- large rounded pill controls as the default treatment
- oversized typography for small utility panels
- excessive shadow stacks and glassy decoration
- wide empty gutters inside docks
- mobile-first oversized hit areas applied unchanged to desktop editor panels

## Scope

These guidelines apply most strongly to:

- shell chrome
- docks
- inspectors
- editors
- toolbars
- layer panels
- asset browsers
- authoring workflows

Document-reading or presentation surfaces may relax density when appropriate, but they should still feel consistent with the same platform.