import { clone, find, propEq, pathOr, isEmpty, isNil } from 'ramda'

// export const getLeafNodes = (nodes: Category[], result: Category[] = []) => {
//   if (nodes && nodes.length) {
//     let length = nodes.length
//     for (let i = 0; i < length; i++) {
//       if (!nodes[i].children || nodes[i].children.length == 0) {
//         result.push(nodes[i])
//       } else {
//         result = getLeafNodes(nodes[i].children, result)
//       }
//     }
//   }
//   return result
// }

// export const searchTree = (
//   treeNode: any,
//   path: string,
//   tailingRegex?: RegExp
// ) => {
//   var result: any = null
//   let link = treeNode.linkEncoded
//     .split('?')[0]
//     .toLowerCase()
//     .replace(/^\//, '')

//   link = tailingRegex ? link.replace(tailingRegex, '') : link

//   let pathToMatch = path
//     .split('?')[0]
//     .replace(/^\//, '')
//     .toLowerCase()

//   pathToMatch = tailingRegex
//     ? pathToMatch.replace(tailingRegex, '')
//     : pathToMatch

//   if (link === pathToMatch) {
//     return treeNode
//   } else if (treeNode.children != null) {
//     //var result = undefined
//     for (var i = 0; result == null && i < treeNode.children.length; i++) {
//       result = searchTree(treeNode.children[i], path, tailingRegex)
//     }
//     return result
//   }

//   return result
// }

// export const categoryTreeSearch = (
//   treeNodes: any,
//   path: string,
//   tailingRegex?: RegExp
// ) => {
//   if (!treeNodes) return null
//   var result: any = null
//   treeNodes.forEach((treeNode: any) => {
//     if (result == null) {
//       result = searchTree(treeNode, path, tailingRegex)
//     }
//   })
//   return result && result.children ? result.children : []
// }

// export const ftSearchTree = (facets: any[]) => {
//   if (!facets || facets.length == 0) {
//     return []
//   }

//   var results: Category[] = [] as Category[]

//   facets.forEach(facet => {
//     results.push({
//       id: facet.id,
//       name: facet.name,
//       href: facet.href,
//       children: ftSearchTree(facet.children),
//       slug: '',
//       imageLabel: '',
//       imageUrl: '',
//       description: '',
//     })
//   })

//   return results
// }

// export const ftSearchCategoryTree = (treeNodes: any) => {
//   if (!treeNodes) return null
//   var results: Category[] = [] as Category[]
//   treeNodes.forEach((treeNode: any) => {
//     results.push({
//       id: '',
//       href: '',
//       name: treeNode.name,
//       children: ftSearchTree(treeNode.facets),
//       slug: '',
//       imageLabel: '',
//       imageUrl: '',
//       description: '',
//     })
//   })
//   return results
// }

// export const removeChildrenAfterNode = (
//   treeNode: any,
//   currentLevel: number,
//   cutoffLevel: number
// ) => {
//   if (!treeNode) {
//     return treeNode
//   }
//   if (currentLevel == cutoffLevel) {
//     treeNode.children = []
//   } else if (currentLevel < cutoffLevel) {
//     currentLevel++
//     for (var i = 0; i < treeNode.children.length; i++) {
//       removeChildrenAfterNode(treeNode.children[i], currentLevel, cutoffLevel)
//     }
//   }
//   return treeNode
// }

// export const removeChildrenAfter = (treeNodes: any, level: number) => {
//   if (!treeNodes) return null
//   return treeNodes.map((treeNode: any) =>
//     removeChildrenAfterNode(treeNode, 1, level)
//   )
// }

export const getLeafNodesByLevel = (
  nodes: Category[],
  cutOffLevel: number = 1,
  result: Category[] = [],
  currentLevel: number = 1
) => {
  if (nodes && nodes.length) {
    let length = nodes.length
    for (let i = 0; i < length; i++) {
      const loopLevel = currentLevel
      if (currentLevel === cutOffLevel) {
        let category = clone(nodes[i])
        category.children = []
        result.push(category)
      } else {
        result = getLeafNodesByLevel(
          nodes[i].children,
          cutOffLevel,
          result,
          loopLevel + 1
        )
      }
    }
  }
  return result
}

export const getLeafNodesByLevelWithChildren = (
  nodes: Category[],
  cutOffLevel: number = 1,
  result: Category[] = [],
  currentLevel: number = 1
) => {
  if (nodes && nodes.length) {
    let length = nodes.length
    for (let i = 0; i < length; i++) {
      const loopLevel = currentLevel
      if (currentLevel === cutOffLevel) {
        let category = clone(nodes[i])
        result.push(category)
      } else {
        result = getLeafNodesByLevelWithChildren(
          nodes[i].children,
          cutOffLevel,
          result,
          loopLevel + 1
        )
      }
    }
  }
  return result
}

export const getChildCategories = (
  treeNodes: any,
  level: number,
  id?: string
) => {
  const nodes = getLeafNodesByLevelWithChildren(clone(treeNodes), level)
  const category = find(propEq('id', id))(nodes)
  return pathOr([], ['children'], category)
}

export const getParentCategoryOfCategory: any = (
  nodes: Category[],
  categoryId: string,
  cutOffLevel: number = 1,
  currentLevel: number = 1
) => {
  if (cutOffLevel === 1) {
    return null
  }

  if (nodes && nodes.length) {
    let length = nodes.length
    for (let i = 0; i < length; i++) {
      const loopLevel = currentLevel

      const matchingChildren = pathOr([], ['children'], nodes[i]).filter(
        (c: Category) => c.id.toString() === categoryId
      )

      if (matchingChildren.length > 0) {
        return nodes[i]
      }
      if (currentLevel === cutOffLevel) {
        continue
      } else {
        const parent = getParentCategoryOfCategory(
          nodes[i].children,
          categoryId,
          cutOffLevel,
          loopLevel + 1
        )
        if (parent != null) {
          return parent
        }
      }
    }
  }
}

export const removeChildren = (nodes: Category[]) => {
  return nodes.map((category: Category) => {
    category.children = []
    return category
  })
}

export const getChildCategoriesUnderSameParent = (
  nodes: Category[],
  categoryId: string,
  cutOffLevel: number = 1
) => {
  if (isNil(categoryId) || isEmpty(categoryId)) {
    return []
  }

  if (cutOffLevel == 1) {
    return removeChildren(clone(nodes))
  }

  const parent = getParentCategoryOfCategory(nodes, categoryId, cutOffLevel)
  return pathOr([], ['children'], parent)
}

// export const getLeafNodesAfter = (
//   nodes: Category[],
//   cutOffLevel: number = 1,
//   result: Category[] = [],
//   currentLevel: number = 1
// ) => {
//   if (nodes && nodes.length) {
//     let length = nodes.length
//     for (let i = 0; i < length; i++) {
//       const loopLevel = currentLevel
//       if (currentLevel === cutOffLevel) {
//         let category = clone(nodes[i])
//         result.push(category)
//       } else {
//         result = result = getLeafNodesAfter(
//           nodes[i].children,
//           cutOffLevel,
//           result,
//           loopLevel + 1
//         )
//       }
//     }
//   }
//   return result
// }

// export const getSelectedCategories = (
//   departments: any[] = [],
//   facets: Facet[] = [],
//   categoryTree: any
// ) => {
//   if (!facets || !facets.length || !categoryTree || !categoryTree.length) {
//     return []
//   }

//   const categoriesSelected = departments.reduce(
//     (accumulator: any[], department: any) => {
//       const name = pathOr('', ['name'], department)
//       const nodes = getLeafNodesAfter(categoryTree, 1)
//       const selectedDepartment = find(propEq('name', name))(nodes)

//       return [...accumulator, ...selectedDepartment.children]
//     },
//     []
//   )

//   const categoriesFiltered = categoriesSelected.reduce(
//     (accumulator: Category[], subCategory: Category) => {
//       const name = pathOr('', ['name'], subCategory)
//       const selectedSubCategory = facets.find(
//         (category: Facet) => category.name == name
//       )
//       return selectedSubCategory ? [...accumulator, subCategory] : accumulator
//     },
//     []
//   )

//   return categoriesFiltered.map((category: Category) => ({
//     id: category.id,
//     name: category.name,
//     href: category.href,
//     slug: category.slug,
//     imageLabel: '',
//     imageUrl: '',
//     description: '',
//     children: [] as Category[],
//   }))
// }

// export const getSelectedSubCategories = (
//   departments: any[] = [],
//   categories: any[] = [],
//   facets: Facet[] = [],
//   categoryTree: any
// ) => {
//   if (!facets || !facets.length) {
//     return []
//   }

//   const categoriesSelected = departments.reduce(
//     (accumulator: any[], department: any) => {
//       const name = pathOr('', ['name'], department)
//       const nodes = getLeafNodesAfter(categoryTree, 1)
//       const selectedDepartment = find(propEq('name', name))(nodes)

//       return selectedDepartment
//         ? [...accumulator, ...selectedDepartment.children]
//         : accumulator
//     },
//     []
//   )

//   const subCategoriesSelected = categoriesSelected.reduce(
//     (accumulator: any[], currentCategory: any) => {
//       const name = pathOr('', ['name'], currentCategory)
//       const selectedSubCategory = categories.find(
//         (category: Category) => category.name == name
//       )
//       return selectedSubCategory
//         ? [...accumulator, ...currentCategory.children]
//         : accumulator
//     },
//     []
//   )

//   const subCategoriesFiltered = subCategoriesSelected.reduce(
//     (accumulator: Category[], subCategory: Category) => {
//       const name = pathOr('', ['name'], subCategory)
//       const selectedSubCategory = facets.find(
//         (category: Facet) => category.name == name
//       )
//       return selectedSubCategory ? [...accumulator, subCategory] : accumulator
//     },
//     []
//   )

//   return subCategoriesFiltered.map((category: Category) => ({
//     id: category.id,
//     name: category.name,
//     href: category.href,
//     slug: category.slug,
//     imageLabel: '',
//     imageUrl: '',
//     description: '',
//     children: [] as Category[],
//   }))
// }

// export const findCategoryByNameAndLevel = (
//   treeNodes: any,
//   name: string,
//   level: number
// ) => {
//   const nodes = getLeafNodesByLevel(treeNodes, level)
//   const category = find(propEq('name', name))(nodes)
//   return category ? { ...category, ...{ children: [] } } : undefined
// }

export const getFilteredChildren: any = (
  categoryTree: Category[],
  slugs: string[],
  level: number = 1
) => {
  if (slugs.length == 0 || categoryTree.length == 0) {
    return [] as Category[]
  }

  if (slugs.length < level) {
    // this is the final level
    return categoryTree.map(category => {
      category.children = []
      return category
    })
  }

  const selectedCategory = categoryTree.find(
    (category: Category) => category.slug === slugs[level - 1]
  )

  return getFilteredChildren(
    selectedCategory ? selectedCategory.children : [],
    slugs,
    ++level
  )
}

export const getTranslatedFilteredChildren: any = (
  categoryTree: Category[],
  searchCategories: Category[],
  slugs: string[],
  level: number = 1
) => {

  console.log(searchCategories)
  if (slugs.length == 0 || categoryTree.length == 0) {
    return [] as Category[]
  }

  if (slugs.length < level) {
    // this is the final level
    return categoryTree.map(category => {
      category.children = []
      const selected = searchCategories.find((c: any) => c.id.toString() === category.id.toString())
      return { ...category, ...{ name: selected ? selected.name : '' } }
    }).filter((c: any) => c.name !== '')
  }

  const selectedCategory = categoryTree.find(
    (category: Category) => category.slug === slugs[level - 1]
  )

  return getTranslatedFilteredChildren(
    selectedCategory ? selectedCategory.children : [],
    searchCategories ? searchCategories : [],
    slugs,
    ++level
  )
}
