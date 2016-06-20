var fs = require('fs')
var mammoth = require('mammoth')

if (!process.argv[2]) {
  process.exit()
}

function BinarySearchTree () {
  this.root = null
}

BinarySearchTree.prototype.Node = function (val) {
  this.value = val
  this.count = 1
  this.left = null
  this.right = null
}

BinarySearchTree.prototype.push = function (val) {
  var root = this.root

  if (!root) {
    this.root = new this.Node(val)
    return
  }

  var currentNode = root
  var newNode = new this.Node(val)

  while (currentNode) {
    if (val === currentNode.value) {
      currentNode.count ++
      break
    } else if (val < currentNode.value) {
      if (!currentNode.left) {
        currentNode.left = newNode
        break
      } else {
        currentNode = currentNode.left
      }
    } else {
      if (!currentNode.right) {
        currentNode.right = newNode
        break
      } else {
        currentNode = currentNode.right
      }
    }
  }
}

BinarySearchTree.prototype._inorder = function (node) {
  if (node) {
    this._inorder(node.left)
    console.log(node.value + ' count:' + node.count)
    this._inorder(node.right)
  }
}

BinarySearchTree.prototype.inorder = function () {
  this._inorder(this.root)
}

var bst = new BinarySearchTree()

mammoth.extractRawText({path: process.argv[2]})
  .then(function (result) {
    fs.writeFile('__temp.txt', result.value, function (err) {
      if (err) {
        return console.log(err)
      }

      console.log('The file was saved!')
    })
  })
  .then(function () {
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream('__temp.txt')
    })

    lineReader.on('line', function (line) {
      line.replace(/[^a-zA-ZčČćĆđĐšŠžŽ ]/g, ' ')
        .split(' ')
        .forEach(function (word) {
          if (word.length > 0) bst.push(word.toUpperCase())
        })
    })

    lineReader.on('close', function () {
      bst.inorder()
      fs.unlink('__temp.txt')
    })
  })
  .done()
