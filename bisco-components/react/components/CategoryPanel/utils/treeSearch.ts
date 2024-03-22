import { Category } from './interfaces'

export const searchTree = (treeNode: any, path: string, tailingRegex?: RegExp) => {
  var result: any = null
  let link = treeNode.linkEncoded
    .split('?')[0]
    .toLowerCase()
    .replace(/^\//, '')

  link = tailingRegex ? link.replace(tailingRegex, '') : link

  let pathToMatch = path
    .split('?')[0]
    .replace(/^\//, '')
    .toLowerCase()

  pathToMatch = tailingRegex ? pathToMatch.replace(tailingRegex, '') : pathToMatch

  if (link === pathToMatch) {
    return treeNode
  } else if (treeNode.children != null) {
    var result = null
    for (var i = 0; result == null && i < treeNode.children.length; i++) {
      result = searchTree(treeNode.children[i], path, tailingRegex)
    }
    return result
  }

  return result
}

export const categoryTreeSearch = (treeNodes: any, path: string, tailingRegex?: RegExp) => {
  if (!treeNodes) return null
  var result: any = null
  treeNodes.forEach((treeNode: any) => {
    if (result == null) {
      result = searchTree(treeNode, path, tailingRegex)
    }
  })
  return result
}

export const ftSearchTree = (facets: any[]) => {

  if(!facets || facets.length == 0) {
    return []
  }

  var results: Category [] = [] as Category []

  facets.forEach(facet => {
    results.push({
      id: facet.id,
      name: facet.name,
      link: facet.href,
      children: ftSearchTree(facet.children)
    })
  })

  return results
}

export const ftSearchCategoryTree = (treeNodes: any) => {
  if (!treeNodes) return null
  var results: Category[] = [] as Category[]
  treeNodes.forEach((treeNode: any) => {
    results.push({
      id: '',
      link: '',
      name: treeNode.name,
      children: ftSearchTree(treeNode.facets),
    })
  })
  return results
}
