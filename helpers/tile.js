export default (map) => {
  var getTile = (handle, index) => {
    var tile = getTilebyHandle(handle)
    if (index) {
      switch (index) {
        case 'up':
          if (tile.l > 0) {
            tile.l = tile.l - 1
          } else {
            tile = false
          }
          break
        case 'down':
          if (tile.l < parseInt(map.tiles.lines) - 1) {
            tile.l = tile.l + 1
          } else {
            tile = false
          }
          break
        case 'left':
          if (tile.c > 0) {
            tile.c = tile.c - 1
          } else {
            tile = false
          }
          break
        case 'right':
          if (tile.c < parseInt(map.tiles.columns) - 1) {
            tile.c = tile.c + 1
          } else {
            tile = false
          }
          break
        case 'digupleft':
          if (tile.l > 0 && tile.c > 0) {
            tile = {
              l: tile.l - 1,
              c: tile.c - 1
            }
          } else {
            tile = false
          }
          break
        case 'digupright':
          if (tile.l > 0 && tile.c < parseInt(map.tiles.columns) - 1) {
            tile = {
              l: tile.l - 1,
              c: tile.c + 1
            }
          } else {
            tile = false
          }
          break
        case 'digdownleft':
          if (tile.l < parseInt(map.tiles.lines) - 1 && tile.c > 0) {
            tile = {
              l: tile.l + 1,
              c: tile.c - 1
            }
          } else {
            tile = false
          }
          break
        case 'digdownright':
          if (tile.l < parseInt(map.tiles.lines) - 1 && tile.c < parseInt(map.tiles.columns) - 1) {
            tile = {
              l: tile.l + 1,
              c: tile.c + 1
            }
          } else {
            tile = false
          }
          break
        default:
          tile = false
      }
    }
    return tile
  }

  var getNextTile = (tile) => {
    return getTile(tile, 'right')
  }

  var getPrevTile = (tile) => {
    return getTile(tile, 'left')
  }

  var getUpTile = (tile) => {
    return getTile(tile, 'up')
  }

  var getDownTile = (tile) => {
    return getTile(tile, 'down')
  }

  var getDiagUpLeftTile = (tile) => {
    return getTile(tile, 'digupleft')
  }

  var getDiagUpRightTile = (tile) => {
    return getTile(tile, 'digupright')
  }

  var getDiagDownLeftTile = (tile) => {
    return getTile(tile, 'digdownleft')
  }

  var getDiagDownRightTile = (tile) => {
    return getTile(tile, 'digdownright')
  }

  var getTilebyHandle = (handle) => {
    if (typeof (handle) === 'string') {
      return {
        l: parseInt(handle.split(':')[0]),
        c: parseInt(handle.split(':')[1])
      }
    }

    return handle
  }

  var getTileHandle = (tile) => {
    return `${tile.l}:${tile.c}`
  }

  var getTileConfig = (t) => {
    var tile = getTilebyHandle(t)
    var n = (map.tiles.columns * tile.l) + tile.c
    return map.config[n]
  }

  var getTileOffset = (t) => {
    var tile = getTilebyHandle(t)
    var dom = document.querySelectorAll(`[data-tile="${tile.l}:${tile.c}"]`)[0]
    return {
      x: dom.offsetLeft,
      y: dom.offsetTop
    }
  }

  var isTileInLine = (t, n) => {
    return getTilebyHandle(t).l === getTilebyHandle(n).l
  }

  var isTileInColumn = (t, n) => {
    return getTilebyHandle(t).c === getTilebyHandle(n).c
  }

  var isTileInCross = (t, n) => {
    return isTileInLine(t, n) || isTileInColumn(t, n)
  }

  var isTileAround = (t, n) => {
    if (t === n) {
      return false
    }

    let tile = getTilebyHandle(t)
    let tilesAround = [
      getTileHandle(getDiagUpLeftTile(tile)),
      getTileHandle(getDiagUpRightTile(tile)),
      getTileHandle(getDiagDownLeftTile(tile)),
      getTileHandle(getDiagDownRightTile(tile))
    ]
    return isTileInCross(t, n) || tilesAround.indexOf(n) >= 0
  }

  return {
    getTile,
    getTilebyHandle,
    getTileHandle,
    getNextTile,
    getPrevTile,
    getUpTile,
    getDownTile,
    getDiagUpLeftTile,
    getDiagUpRightTile,
    getDiagDownLeftTile,
    getDiagDownRightTile,
    getTileConfig,
    getTileOffset,
    isTileInLine,
    isTileInColumn,
    isTileInCross,
    isTileAround
  }
}
