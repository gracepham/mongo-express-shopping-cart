var express = require('express');
var router = express.Router();

// load model
const {Page} = require('../models/pages');

// route:   /admin/pages
// method:  GET
// desc:    đi đến trang pages
router.get('/', function(req, res, next) {
  Page.find()
    .then(pages => {
      res.render('admin/pages', {
        title: "Page Management", pages})    
    })
    .catch(console.log)
});

// route:   /admin/pages/add-page
// method:  GET
// desc:    đi đến trang addPage
router.get('/add-page', (req, res) => {
  const title = "";
  const slug = "";
  const content = "";

  res.render('admin/addPage', {
    title,  slug, content
  })
})

// route:   /admin/pages/add-page
// method:  POST
// desc:    thực hiện chức năng add page
router.post('/add-page', (req, res) => {
  // validate
  req.checkBody('title', 'Title must have a value').notEmpty()
  req.checkBody('content', 'Content must have a value').notEmpty()

  let {title, slug, content} = req.body;
  slug = slug.replace(/\s+/g, "-").toLowerCase()
  if(slug === "") slug = title.replace(/\s+/g, "-").toLowerCase()

  var errors = req.validationErrors();
  console.log(errors)
  if(errors) return res.render('admin/addPage', {title, slug, content, errors})

  Page.findOne({slug})
    .then(page => {
      if(page) {
        req.flash('danger', "Page slug exist, choose another one")
        res.render('admin/addPage', {title, slug, content})
      } else {
        const newPage = new Page({title, slug, content})
        newPage.save()
          .then(() => {
            req.flash('success', "Page added successfully");
            res.redirect('/admin/pages')
          })
          .catch(console.log)
      }
    })
    .catch(console.log)
})

// route:   /admin/pages/edit-page/:slug
// method:  GET
// desc:    di den trang editPage
router.get('/edit-page/:slug', (req, res) => {
  const {slug} = req.params
  Page.findOne({slug})
    .then(page => {
      if(!page) return console.log("Page does not exist")
      const {title, content} = page
      res.render('admin/editPage', {title, slug, content, id: page._id})
    })
})

// route:   /admin/pages/edit-page/:slug
// method:  POST
// desc:    thực hiện chức năng add page
router.post('/edit-page/:slug', (req, res) => {
  // validate
  req.checkBody('title', 'Title must have a value').notEmpty()
  req.checkBody('content', 'Content must have a value').notEmpty()

  let {title, slug, content, id} = req.body;
  slug = slug.replace(/\s+/g, "-").toLowerCase()
  if(slug === "") slug = title.replace(/\s+/g, "-").toLowerCase()

  var errors = req.validationErrors();
  console.log(errors)
  if(errors) return res.render('admin/editPage', {title, slug, content, errors})

  Page.findOne({slug, _id: {$ne: id} })
    .then(page => {
      if(page) {
        req.flash('danger', "Page slug exist, choose another one")
        res.render('admin/editPage', {title, slug, content, id})
      } else {
        Page.findById(id)
          .then(page => {
            if(!page) return console.log("Page does not exist")
            
            page.title = title
            page.slug = slug
            page.content = content
            return page.save()
          })
          .then(() => {
            req.flash('success', 'Page edited successfully')
            res.redirect('/admin/pages')
          })
          .catch(console.log)
      }
    })
    .catch(console.log)
})
 
// route:   /admin/pages/delete-page/:id
// method:  POST
// desc:    thực hiện chức năng delete page
router.get('/delete-page/:id', (req, res) => {
  const {id} = req.params
  Page.deleteOne({_id: id})
    .then(() => {
      req.flash('warning', 'Page deleted')
      res.redirect('/admin/pages')
    })
    .catch(console.log)
})

module.exports = router;
