var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');

// load model
const {Category} = require('../models/categories');
const {Product} = require('../models/products');

// route:   /admin/categories
// method:  GET
// desc:    đi đến trang categories
router.get('/', function(req, res, next) {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        title: "Products Management", products})    
    })
    .catch(console.log)
});

// route:   /admin/products/add-product
// method:  GET
// desc:    đi đến trang add product
router.get('/add-product', function(req, res, next) {
  const title = ''
        slug = ''
        desc = ''
        price = ''
        image = ''
  Category.find()
      .then( categories => {
        res.render('admin/addProduct', {title, slug, desc, price, image, categories});
      })
      .catch(console.log());
});

// route:   /admin/products/add-product
// method:  POST
// desc:    thực hiện chức năng add page
router.post('/add-product', (req, res) => {
  console.log(req.files);
  const fileName = req.files.image ? req.files.image.name : "-";
  // // validate
  req.checkBody('title', 'Title must have a value').notEmpty()
  req.checkBody('desc', 'Content must have a value').notEmpty()
  req.checkBody('price', 'Content must have a value').notEmpty()
  req.checkBody('image', "Image type must be (.png, .jpg, .jpeg) ").isImage(fileName)
  console.log('Filename after validate:' + fileName);
  let {title, slug, desc, price, image, category} = req.body;
  slug = slug.replace(/\s+/g, "-").toLowerCase()
  if(slug === "") slug = title.replace(/\s+/g, "-").toLowerCase()

  var errors = req.validationErrors();
  console.log(errors)
  if(errors) {
    Category.find()
      .then(categories => {
        res.render('admin/addProduct', {title, slug, desc, price, image, categories, errors});
      })
  } else {
    Product.findOne({slug})
      .then( product => {
        if(product) {
          Category.find()
            .then(categories => {
              req.flash('warning', 'Product slug exist!');
              res.render('admin/addProduct', {title, slug, desc, price, image, categories, errors});
            })
        } else {
          var newProduct = new Product({
            title, slug, desc, price, image: fileName, category
          })

          if(fileName !== '') {
            // create folder contain image
            mkdirp('public/images/'+newProduct.slug, console.log)

            // move image to folder
            var productImage = req.files.image;
            var path = 'public/images/' + newProduct.slug + '/' + fileName;

            productImage.mv(path, console.log);
          }

          newProduct.save()
            .then( product => {
              console.log(product);
              Product.find()
                .then( products => {
                  res.render('admin/products', {title: "Products Management", products});
                })
            })
            .catch( errors => {
              console.log('error save product', errors)
              Category.find()
                .then(categories => {
                  res.render('admin/addProduct', {title, slug, desc, price, image, categories, errors});
                })
            })
        }
      })
  }
})

// route:   /admin/products/delete-product
// method:  POST
// desc:    thực hiện chức năng delete product
router.get('/delete-product/:slug', (req, res) => {
  const {slug} = req.params
  const path = 'public/images/' + slug;
  Product.deleteOne({slug})
    .then(() => {
      fs.remove(path, console.log);
      req.flash('warning', 'Product deleted')
      res.redirect('/admin/products')
    })
    .catch(console.log)
})

module.exports = router;
