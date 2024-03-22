export const sortManufacturersByName = (brands: any[]) => {
    return brands? brands.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1): []
}