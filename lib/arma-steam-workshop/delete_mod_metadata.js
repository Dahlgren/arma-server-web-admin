function parseSize (size) {
  if (size) {
    return parseInt(size, 10)
  }

  return null
}

module.exports = function (data, workshopId) {
  if (data.AppWorkshop) {
    var workshop = data.AppWorkshop
    var sizeOnDisk = parseSize(workshop.SizeOnDisk)
    var installedItems = workshop.WorkshopItemsInstalled

    if (installedItems && installedItems[workshopId]) {
      var itemSize = parseSize(installedItems[workshopId].size)
      delete installedItems[workshopId]

      if (sizeOnDisk && itemSize) {
        workshop.SizeOnDisk = sizeOnDisk - itemSize
      }
    }

    if (workshop.WorkshopItemDetails && workshop.WorkshopItemDetails[workshopId]) {
      delete workshop.WorkshopItemDetails[workshopId]
    }
  }

  return data
}
