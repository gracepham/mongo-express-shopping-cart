var express = require('express');
var router = express.Router();

// load model
const {Category} = require('../models/categories');

// route:   /admin/categories
// method:  GET
// desc:    đi đến trang categories
router.get('/', function(req, res, next) {
  Category.find()
    .then(categories => {
      res.render('admin/categories', {
        title: "Cate Management", categories})    
    })
    .catch(console.log)
});

// route:   /admin/categories/add-category
// method:  GET
// desc:    đi đến trang add category
router.get('/add-category', function(req, res, next) {
  res.render('admin/addCategory',{ title: '', slug: ''});
});

// route:   /admin/add-category
// method:  POST
// desc:    thực hiện chức năng add category
router.post('/add-category', (req, res) => {
  // validate
  req.checkBody('title', 'Title must have a value').notEmpty()

  let {title, slug} = req.body;
  slug = slug.replace(/\s+/g, "-").toLowerCase()
  if(slug === "") slug = title.replace(/\s+/g, "-").toLowerCase()

  var errors = req.validationErrors();
  console.log(errors)
  if(errors) return res.render('admin/addCategory', {title, slug, errors})

  Category.findOne({slug})
    .then(cate => {
      if(cate) {
        req.flash('danger', "Cate slug exist, choose another one")
        res.render('admin/addCategory', {title, slug})
      } else {
        const newCate = new Category({title, slug})
        newCate.save()
          .then(() => {
            req.flash('success', "Cate added successfully");
            res.redirect('/admin/categories')
          })
          .catch(console.log)
      }
    })
    .catch(console.log)
})




module.exports = router;
