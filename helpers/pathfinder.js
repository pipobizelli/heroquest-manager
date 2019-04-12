// import $ from 'jquery'
import Tile from './tile'
export default (map) => {
  var getPossibilities = (tile) => {
    var tileUp = Tile(map).getUpTile(tile)
    var tileDown = Tile(map).getDownTile(tile)
    var tileLeft = Tile(map).getPrevTile(tile)
    var tileRight = Tile(map).getNextTile(tile)
    var config = map.config[tile].config.split('')
    var arr = []

    if (config[0] === '0') {
      arr.push(`${tileUp.l}:${tileUp.c}`)
      // $(`[data-tile='${tileUp.l}:${tileUp.c}']`).addClass('tile--green')
    }

    if (config[1] === '0') {
      arr.push(`${tileRight.l}:${tileRight.c}`)
      // $(`[data-tile='${tileRight.l}:${tileRight.c}']`).addClass('tile--green')
    }

    if (config[2] === '0') {
      arr.push(`${tileDown.l}:${tileDown.c}`)
      // $(`[data-tile='${tileDown.l}:${tileDown.c}']`).addClass('tile--green')
    }

    if (config[3] === '0') {
      arr.push(`${tileLeft.l}:${tileLeft.c}`)
      // $(`[data-tile='${tileLeft.l}:${tileLeft.c}']`).addClass('tile--green')
    }

    return arr
  }

  var validPath = (t1, t2) => {
    var tile1 = Tile(map).getTile(t1)
    var tile2 = Tile(map).getTile(t2)
    var t1Config = map.config[t1].split('')

    if (Tile(map).isTileInLine(t1, t2)) {
      if (tile1.l > tile2.l && t1Config[1] === '0') {
        return t2
      }

      if (tile1.l < tile2.l && t1Config[3] === '0') {
        return t2
      }
    }

    if (Tile(map).isTileInColumn(t1, t2)) {
      if (tile1.c > tile2.c && t1Config[2] === '0') {
        return t2
      }

      if (tile1.c < tile2.c && t1Config[0] === '0') {
        return t2
      }
    }

    return false
  }

  var getAllPaths = (tile, arr = []) => {
    arr.push(tile)
    // $(`[data-tile='${tile}']`).addClass('tile--green')
    var pos = getPossibilities(tile)
    // for (var p in pos) {
    pos.forEach(p => {
      if (arr.indexOf(p) < 0) {
        getAllPaths(p, arr)
      }
    })
    return arr
  }

  var getPath = (start, end, path) => {
    // F = G + H
    // G = 10
    // H = getShortPath(start, end) * 10
    // var path = [start]

    if (start === end) {
      return []
    }

    var open = []
    var possibles = getPossibilities(start).filter((p) => {
      return p !== start && path.indexOf(p) < 0
    })

    for (var p in possibles) {
      var obj = {
        tile: possibles[p],
        h: getShortPath(possibles[p], end).length
      }
      open.push(obj)
    }

    var minor = open.sort((a, b) => {
      return a.h - b.h
    })

    var tile = minor[0].tile
    // $(`[data-tile='${tile}']`).addClass('tile--yellow')

    if (path.indexOf(tile) < 0) {
      path.push(tile)
    }

    if (tile !== end) {
      getPath(tile, end, path)
    }

    return path
  }

  var getShortPath = (s, t) => {
    var start = Tile(map).getTile(s)
    var target = Tile(map).getTile(t)
    var path = []
    var lines = getProgression(start.l, target.l)
    var columns = getProgression(start.c, target.c)
    var lastLine = start.l
    var lastCollumn = start.c

    for (var l in lines) {
      lastLine = lines[l]
      path.push(`${lastLine}:${lastCollumn}`)
    }

    for (var c in columns) {
      lastCollumn = columns[c]
      if (path.indexOf(`${lastLine}:${lastCollumn}`) < 0) {
        path.push(`${lastLine}:${lastCollumn}`)
      }
    }

    return path
  }

  var getProgression = (a, b) => {
    var arr = []
    if (a < b) {
      while (a <= b) {
        arr.push(a)
        a++
      }
    } else if (a >= b) {
      while (a >= b) {
        arr.push(a)
        a--
      }
    } else {
      arr.push(a)
    }

    return arr
  }

  return {
    getShortPath,
    getPath,
    getAllPaths,
    getPossibilities,
    validPath
  }
}
