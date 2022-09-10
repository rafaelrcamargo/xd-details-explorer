// Types
import type { CharacterStyleAsset, ColorAsset } from "assets"
import type { GraphicNode, SceneNode } from "scenegraph"

// Libs
import { error } from "./libs/dialogs"
import { getName } from "./helpers/color"

const assets = require("assets")

// * Get all colors from Assets
type Colors = { name: string; color: string }[]
const getColors = (): Colors => {
  const allColors: ColorAsset[] = assets.colors.get()

  return allColors.map(({ name, color }) => {
    const tone: string = color.toHex(true),
      acronym: string = name || getName(tone)

    return {
      name: acronym.toLocaleLowerCase(),
      color: tone.toLocaleLowerCase()
    }
  })
}

const filterProperties = (first: unknown[], second: unknown[]) => {
  return first.filter(item => {
    return second.indexOf(item) < 0
  })
}

// * Get all Character Styles from Assets
type Families = { name: string; weights: string[]; styles: string[] }[]
const getTypography = (): Families => {
  const allCharacterStyles: Array<CharacterStyleAsset> = assets.characterStyles.get()

  const families = allCharacterStyles
    .map(({ style: { fontFamily, fontStyle } }) => {
      // filter styles from the weight array
      const weight = fontStyle.split(" ")[0]
      const style = fontStyle.split(" ")[1]

      return {
        name: fontFamily,
        weights: [weight],
        styles: style ? [style] : []
      }
    })
    .reduce((acc: any, { name, weights, styles }) => {
      const family: any = acc.find(({ name: n }: { name: any }) => n === name)

      if (family) {
        // Add new to object
        if (weights) family.weights = [...new Set([...family.weights, ...weights])]
        if (styles) family.styles = [...new Set([...family.styles, ...styles])]

        // Remove all duplicates, styles and weights
        family.weights = filterProperties(family.weights, family.styles)
        family.styles = filterProperties(family.styles, family.weights)
      } else {
        // Just add new object
        acc.push({ name, weights, styles })
      }

      return acc
    }, [])

  return families
}

// * Show error dialog
async function showError() {
  await error(
    // ? Title
    "No content found in this document",
    // ? Body
    "Please check the recommendations below and try again:",
    "* Check if you have any artboards in your document",
    "* Check if you have any layers in your artboards",
    "* Save your document",
    "* Try again in a few minutes"
  )
}

// * Flatten children array
type Nodes = Partial<GraphicNode>
type Childs = Partial<GraphicNode>[] | SceneNode[]
const flattenChildren = (node: Nodes, children: Childs) =>
  node?.children?.forEach(nodeChild => {
    nodeChild && children.push(nodeChild)
    nodeChild.children.length && flattenChildren(nodeChild, children)
  })

const deepTreeSearch = (_: XDSelection, documentRoot: Nodes) => {
  const artboardFlattenedChildren: Nodes[] = []

  if (documentRoot?.children?.length) {
    documentRoot.children.forEach(documentItem => {
      if (documentItem.constructor.name === "Artboard") {
        artboardFlattenedChildren.push(documentItem)
        flattenChildren(documentItem, artboardFlattenedChildren)
      }
    })
  } else {
    showError()
  }

  if (!artboardFlattenedChildren.length) return

  artboardFlattenedChildren.forEach(node => {
    console.log(node)
  })
}

// * Commands
const extract = (_: XDSelection, documentRoot: Nodes) => {
  const artboardFlattenedChildren: Nodes[] = []

  // * Colors
  const colors = getColors()
  console.log(colors)

  // * Typography
  const typography = getTypography()
  console.log(typography)

  if (documentRoot?.children?.length) {
    documentRoot.children.forEach(documentItem => {
      if (documentItem.constructor.name === "Artboard") {
        artboardFlattenedChildren.push(documentItem)
        flattenChildren(documentItem, artboardFlattenedChildren)
      }
    })
  } else {
    showError()
  }

  if (!artboardFlattenedChildren.length) return

  artboardFlattenedChildren.forEach(node => {
    console.log(node)
  })
}

const copy = () => {}
const save = () => {}
const view = () => {}

exports.commands = { copy, save, view }
