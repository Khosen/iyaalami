const express = require('express');
const router = express.Router();
 const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const propertydb = require('../models/propertyType');
const listing = require('../models/listingdb');
const { render } = require('ejs');
const multer = require('multer');
const path = require('path');
//const { ContextBuilder } = require('express-validator/src/context-builder');
const {ensureAuthenticated} = require('../config/auth');
//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});
//init upload
const upload = multer({
    storage: storage,
    limits: {fileSize:2000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).array('image', 5);


//for floor plan

//set storage engine
/*const floorStorage = multer.diskStorage({
    destination: './public/floorPlans',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});
//init upload
const floorUpload = multer({
    storage: floorStorage,
    limits: { fileSize: 2000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('florImage');*/


//check file type
function checkFileType(file, cb) {
    //allowed ext
    const filetypes = /png|jpg|jpeg/;
    //check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);

    } else {
       
        cb('Error: only jpeg, jpg, and png allowed');
    }
}

router.get('/login', (req, res) => {
    // req.flash('message');
    res.render('login', {
        message: req.flash('error')
    });
});




router.get('/register',  (req, res) => {
    res.render('register');
});

var date = Date.now()
    //Register user


router.post('/register', check('username', 'username is required').not().isEmpty(),
    check('password', 'password is required').isLength({ min: 5 }).withMessage('Password must be atleast 5 characters')
    .custom((value, { req }) => {
        if (value !== req.body.password2) {
            return false;
        } else {
            return value;
        }

    }).withMessage('passwords do not  match'),
    // check('password2', 'passwords do not match').custom()
    //check('password2', 'passwords do not match').equals(req.body.password)
    (req, res) => {

        console.log(req.body);
        // check validate date
        const result = validationResult(req);
        var errors = result.errors;

        for (var key in errors) {
            console.log(errors[key].value);

        }
        if (!result.isEmpty()) {
            //response validate data to register.ejs
            res.render('register', { errors: errors })
                //req.flash('register', { errors: errors })
                // req.flash(errors);
        } else {
            var userName = req.body.username;
            var newUser = new User({

                username: req.body.username,
                name: userName,
                password: req.body.password,
                date: date
            });

            User.createUser(newUser, function(err, user) {
                if (err) throw err;
                //  req.flash('success_msg', 'Data has created successfully!');

                console.log(user);
            });

            req.flash('message', 'you are now registered and can now login');
            // ;

            res.redirect('/admin/confirmPage');
        }
    });


router.get('/details',ensureAuthenticated,(req, res) => {
    propertydb.aggregate([
       // {$match:{address:{$ne:null}, available:'Yes'}},
      //  {$group:{_id:{address:'$address'}}},
        {$project:{type:1, _id:0}}
        ], function(err, types){
            if (err) throw err;
                            console.log(types);
             res.render('details', {types:types});//, message:req.flash('message')});
     });
    //req.flash('message', 'You are not logged in');
   // res.render('details', {msg: req.flash('msg')}); // { msg: 'File Saved' });
});

router.post('/details', (req, res) => {
    upload(req, res, (err) => {
        if (err) throw err;
           
               //get images and ensure they comply to the rules before upload
            if(req.files ===undefined || req.files.length==0){

                res.render('details', { message: 'Error: No File Selected!' });
            } else {
              
              var filenames = req.files.map(function(file) {
                                    
                        return `uploads/`+file.filename;
                    });
              
                    //get data from client and prep to send to db
                    var uploadedby="Admin";
                    var criteria = req.body.propertyDescription + "-" + req.body.address + "-" +req.body.structure;
                let newListing = new listing({
                    type:req.body.type,
                    price: req.body.price,
                    projectName: req.body.projectName,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    units:req.body.unit,
                    description: req.body.propertyDescription,
                    situation: req.body.situation,
                    features: req.body.features,
                    image: filenames,
                    status: req.body.status,
                    floorImage: filenames,
                    uploadedBy: uploadedby,
                    district:req.body.district,
                    available:req.body.available,
                    structure:req.body.structure,
                    criteria: criteria,
                    date: Date.now()
                });

               listing.createUser(newListing, (err, listingDetails) => {
                    if (err) throw err;
                    console.log(listingDetails);

                });
                console.log(newListing);

                req.flash('message', 'File Saved!');
                res.redirect('/admin/details');


            }

       // }

  //  });

    /*floorUpload(req, res, (err) => {
        if (err) {
            res.render('details', {
                msg: err
            });
        } else {
            console.log(req.file);
            if (req.file == undefined) {
                res.render('details', { msg: 'Error: No File Selected!' });
            } else {
                console.log("inside here");
                res.render('details', {
                    msg: 'File Uploaded!',
                    file: `floorPlans/${req.file.filename}`

                });
                console.log({ file: `floorPlans/${req.file.filename}` });
            }
        }

    });*/
});
router.get('/confirmPage', (req, res) => {
    res.render('confirmPage', { message: req.flash('message') });
});

//login handle
router.post('/login', (req, res, next)=>{

 passport.authenticate('local', {
        successRedirect: '/admin/menu',
        failureRedirect: '/admin/login',
        failureFlash: true
    }) (req, res, next);
    
    });
  

router.get('/menu',ensureAuthenticated, (req, res) => {
    res.render('menu', {username: req.user.username});
});

router.get('/soldProperties', (req, res)=>{
res.render('soldProperties')
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('error', 'You are logged out');
    res.redirect('/admin/login');
});


router.get('/landForm', ensureAuthenticated,(req, res)=>{
    res.render('landForm', { message: req.flash('message') })
 });

 //post details from landform to db
router.post('/landForm', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('landForm', {
                msg: req.flash(err)//err
            });
        } else {
            
            if(req.files ===undefined || req.files.length==0){

                res.render('landForm', { message: 'Error: No File Selected!' });
            } else {
                       var filenames = req.files.map(function(file) {
                                    
                        return `uploads/`+file.filename;
                    });
                    var criteria = req.body.address + "-" + req.body.landDescription;
                       var uploadedby="Admin";
                let newListing = new listing({
                    address: req.body.address,
                    district: req.body.district,
                    description:req.body.landDescription,
                    city: req.body.city,
                    state: req.body.state,
                    price:req.body.price,
                    image: filenames,
                    floorImage: filenames,
                    uploadedBy: uploadedby,
                    fee: req.body.fee,
                    criteria:criteria,
                    title:"Land",
                    available:"Yes",
                    date: Date.now()
                });

                listing.createUser(newListing, (err, listingDetails) => {
                    if (err) throw err;
                    console.log(listingDetails);

                });
                console.log(newListing);

                req.flash('message', 'File Saved!');
                res.redirect('/admin/landForm');


            }

        }

    });

    
});
router.get('/propertyType', ensureAuthenticated,(req, res)=>{
    res.render('propertyType',{message:req.flash('message')});
})

router.post('/propertyType', (req, res)=>{

    let newProperty = new propertydb({
        type: req.body.type,
        date: Date.now()
    });
    
    propertydb.createUser(newProperty, (err, propertyDetails) => {
        if (err) throw err;
        console.log(propertyDetails);

    });
    console.log(newProperty);

    req.flash('message', 'File Saved!');
    res.redirect('/admin/propertyType');

})


//populate dropdown
router.get('/sold',ensureAuthenticated, (req, res)=>{
   // listing.find({address:})
   listing.aggregate([
       {$match:{criteria:{$ne:null}, available:'Yes'}},
   //  {$group:{_id:{type:'$type'}}},
       {$project:{criteria:1, _id:0}}
       ], function(err, docs){
           if (err){

           }else{
               console.log(docs);
               res.render('sold', {docs:docs, message:req.flash('message')});
           }

    });
  
});

router.get('/getData', (req, res)=>{
    listing.aggregate([
        
       //{$match:{address:req.params.status}},
        {$project:{
            address:1,
            description:1,
            projectName:1,
            district:1,
            city:1,
            state:1,
            type:1,
            units:1,
            criteria:1


    }}], function(err, docs){
        if(err)throw err;
       // console.log(docs);
      //  console.log(req.params.status);
      
        res.send(docs);
    });
});

 
router.post('/sold', (req, res)=>{
  let newUnit =  parseInt(req.body.noSold);
  
   listing.findOneAndUpdate( {address:req.body.status, description:req.body.title},
      //  {$match:{$and:[{address:req.params.address} , {description:req.params.description}]}},
       {$inc:{units:-newUnit}} 

         
    , function(err, docs){
        if(err) throw err;
      //  console.log( newUnit  +""+ req.body.title +"" + req.body.status);
      req.flash('message', 'New units value updated');
        res.redirect('sold');

    })
  
});

});


module.exports = router;