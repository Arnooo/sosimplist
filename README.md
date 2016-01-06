# - Sosimplist -
<a href="https://codeclimate.com/github/Arnooo/sosimplist"><img src="https://codeclimate.com/github/Arnooo/sosimplist/badges/gpa.svg" /></a>
[![Build Status](https://semaphoreci.com/api/v1/projects/2b18da5b-6a83-4ff8-a7ca-083ff920664f/649186/shields_badge.svg)](https://semaphoreci.com/arnooo/sosimplist)
[![Coverage Status](https://coveralls.io/repos/Arnooo/sosimplist/badge.svg?branch=master&service=github)](https://coveralls.io/github/Arnooo/sosimplist?branch=master)

A simple list library in Javascript. **No dependencies**

This simple list library is inspired by Google Keep application. 


[Live demo here: arnooo.github.io/sosimplist](http://arnooo.github.io/sosimplist/#eyJ2aWV3SWRfIjoidmlldy1zb3NpbXBsaXN0IiwibWFwT2ZMaXN0XyI6eyJzb3NpbXBsaXN0LWxpc3QxNDUyMDc4NDU2MDYzIjoie1wiaWRfXCI6XCJzb3NpbXBsaXN0LWxpc3QxNDUyMDc4NDU2MDYzXCIsXCJ0aXRsZV9cIjpcIlRPRE9cIixcImFycmF5T2ZJdGVtX1wiOltcIntcXFwiaWRfXFxcIjpcXFwic29zaW1wbGlzdC1pdGVtMTQ1MjA3ODQ1NjA2M1xcXCIsXFxcImNoZWNrZWRfXFxcIjpmYWxzZSxcXFwidGV4dF9cXFwiOlxcXCJOZXh0IGZlYXR1cmVcXFwifVwiLFwie1xcXCJpZF9cXFwiOlxcXCJzb3NpbXBsaXN0LWl0ZW0xNDUyMDc4NDY0NzAzXFxcIixcXFwiY2hlY2tlZF9cXFwiOmZhbHNlLFxcXCJ0ZXh0X1xcXCI6XFxcIlxcXCJ9XCJdfSIsInNvc2ltcGxpc3QtbGlzdDE0NTIwNzg0Njg1MDMiOiJ7XCJpZF9cIjpcInNvc2ltcGxpc3QtbGlzdDE0NTIwNzg0Njg1MDNcIixcInRpdGxlX1wiOlwiXCIsXCJhcnJheU9mSXRlbV9cIjpbXCJ7XFxcImlkX1xcXCI6XFxcInNvc2ltcGxpc3QtaXRlbTE0NTIwNzg0Njg1MDNcXFwiLFxcXCJjaGVja2VkX1xcXCI6ZmFsc2UsXFxcInRleHRfXFxcIjpcXFwiXFxcIn1cIl19In19)

## Getting Started

### Using npm package manager
```
npm install --save --production sosimplist
```

Include the JS library and the stylesheet in your code

```
<link rel="stylesheet" href="node_modules/sosimplist/style.css" />
<script  type="text/javascript" src="node_modules/sosimplist/dist/sosimplist.min.js"></script>
```

### Using last online version

```
<link rel="stylesheet" href="http://arnooo.github.io/sosimplist/style.css" />
<script  type="text/javascript" src="http://arnooo.github.io/sosimplist/dist/sosimplist.min.js"></script>
```
### Then initialize the Sosimplist object in your code

```
sosimplist.init('ELEMENT_ID',{edit:true});
```

That's it !

## Example
Check the index.html and style.css file for a quick exemple how to use it.

## Features
* Add List
* Add Simple Item
* Data saved in the URL
* Editable mode option {edit:true|false}
* Reorder items by drag and drop
* Hide checked items

## Upcoming features
* A-Z and Z-A ordering

