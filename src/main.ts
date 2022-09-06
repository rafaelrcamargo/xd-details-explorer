import type { GraphicNode, SceneNode } from "scenegraph"
const { error } = require("./lib/dialogs.js")

type Nodes = Partial<GraphicNode>

async function showError() {
  await error(
    "No content found in this document",
    "Please check the recommendations below and try again:",
    "* Check if you have any artboards in your document",
    "* Check if you have any layers in your artboards",
    "* Save your document",
    "* Try again in a few minutes"
  )
}

const flattenChildren = (node: Nodes, children: any[]) =>
  node?.children?.forEach(nodeChild => {
    children.push(nodeChild)

    if (nodeChild.children.length) {
      flattenChildren(nodeChild, children)
    }
  })

const extract = (_: XDSelection, documentRoot: Nodes) => {
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
    console.error("No children found")
  }

  if (!artboardFlattenedChildren.length) return

  artboardFlattenedChildren.forEach(node => {
    console.log("AAA:", node)
  })
}

exports.commands = { extract }
