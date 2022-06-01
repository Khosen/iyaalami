const express = require('express');
const router = express.Router();
const listing = require('../models/listingdb');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config();

//show file to web
router.get('/', (req, res) => {
    listing.aggregate([
            { $match: { 'status': 'Now-Selling' } },
           // {$unwind:'$features'},
            {
                $group:{_id:{projectName:'$projectName', address:'$address', price:'$price',
            status:'$status', description:'$description', city:'$city', state:'$state', units:'$units',
               // features:{$split:["$features", ","]},
                 features:'$features', image:'$image'}}//image:{$arrayElemAt:["$image",0]}}}
             },
              {
                $project: {
                    features: { $split: ["$_id.features", ","] },
                    'projectName': '$_id.projectName',
                    'address': '$_id.address',
                    'price': '$_id.price',
                    'status': '$_id.status',
                    'description': '$_id.description',
                    'city': '$_id.city',
                    'state': '$_id.state',
                    'units':'$_id.units',
                    //'image':'$_id.image',
                   image: { $arrayElemAt: [ "$_id.image", 0 ] },
              //     'image': 1,
                    //'date': 1,
                    _id: 0
                }
            },
           
           /* {
                $project: {
                    features: { $split: ["$features", ","] },
                    'projectName': 1,
                    'address': 1,
                    'price': 1,
                    'nowSelling': 1,
                    'description': 1,
                    'city': 1,
                    'state': 1,
                    'units':1,
                    image: { $arrayElemAt: [ "$image", 0 ] },
              //     'image': 1,
                    'date': 1,
                    _id: 0
                }
            },*/
           


            { $sort: { date: -1 } }, 
            {$limit:6}
        ],
        function(err, docs) {
            if (err) throw err;
                //console.log(err);
         ///   } else {
             console.log(docs);

                res.render('index', { docs: docs });
          //  }

        }


    );

 
});


router.get('/about', (req, res) => {
    listing.aggregate([
        { $match: {'available': 'Yes' } },

        {
            $project: {
                features: { $split: ["$features", ","] },
                'projectName': 1,
                'address': 1,
                'price': 1,
                'nowSelling': 1,
                'description': 1,
                'city': 1,
                'state': 1,
                image: { $arrayElemAt: [ "$image", 0 ] },
                'district':1,
               //'image': 1,
                'date': 1,
                _id: 1
            }
        },
   
    ],
    function(err, docs) {
        if (err) {

        } else {
         
            res.render('about', { docs: docs });
        }

    }
    );
    
});

router.get('/projects', (req, res)=>{
    listing.aggregate([
       // { $match: {'available': 'Yes' } },
       {$match:{'status': 'On-going'}},
       {$unwind: '$image'},
       {$group:{_id:{district:'$district', projectName: '$projectName', date: { $substr: ["$date", 0, 10] }, status:'$status', city:'$city', state:'$state'},
       image: { $first : "$image"},  
                     
    }},
    //image: { $first : "$image" }  }},
       {
        $project: {
        
           district:"$_id.district",
           // image:"$_id.image",
        status:"$_id.status",
            city:"$_id.city",   
            state:"$_id.state",
            projectName:"$_id.projectName",
            image:1,
            date: "$_id.date"
        }
      
        },
   
    ],
    function(err, docs) {
        if (err) {

        } else {
           // console.log(docs[0].image + docs[0].projectName+ docs[1].image + docs[1].projectName +'here');
          //  console.log(docs);
           res.render('projects', { docs: docs });
        }

    }
    );
});

/*router.get('/Cprojects', (req, res)=>{
    listing.aggregate([
       // { $match: {'available': 'Yes' } },
       {$match:{'status': 'Completed'}},
       {$unwind: '$image'},
       {$group:{_id:{district:'$district', projectName: '$projectName', status:'$status', city:'$city', state:'$state'},
      image: { $first : "$image"}
    }},
    //image: { $first : "$image" }  }},
       {
        $project: {
        
           district:"$_id.district",
           // image:"$_id.image",
        status:"$_id.status",
            city:"$_id.city",   
            state:"$_id.state",
            projectName:"$_id.projectName",
            image:1 // district:"$_id.district"
           }}
      
    ],
    function(err, doc) {
        if (err) {

        } else {
           // console.log(docs[0].image + docs[0].projectName+ docs[1].image + docs[1].projectName +'here');
          //  console.log("starts" +doc);
           res.render('Cprojects', { doc: doc});
        }

    }
    );
});*/
router.get('/projectListing/:district', (req, res)=>{

    listing.aggregate([
        {$match:{'district':req.params.district, status:'On-going'}},
        {$unwind:'$image'},
        
        {$project: {
            image: 1
        }}
    ], function(err, docs) {
        if (err){

        }
        else{
           // console.log(req.params.district + docs)
            res.render('projectListing', {docs:docs});
        }

    });
   
});

router.get('/projectGallery', (req, res)=>{

    listing.aggregate([
        {$match:{'status':"On-going"}},
        {$unwind:'$image'},
        {$group:{_id:{district:'$district', projectName: '$projectName', image:'$image', status:'$status', city:'$city', state:'$state'},
       // image: { $first : "$image"}
     }},
        {$project: {
            image: '$_id.image',
            district:'$_id.district',
            state:'$_id.state',
            city:'$_id.city'
        }}
    ], function(err, docs) {
        if (err){

        }
        else{
          //  console.log(req.params.district + docs)
            res.render('projectGallery', {docs:docs});
        }

    });
   
});
router.get('/contact', (req, res)=>{

    res.render('contact' , {message: req.flash('message')});
});
router.post('/contact', (req, res)=>{
  
    let transport = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
   
        //port: 2525,
        auth: {
           user:  process.env.AUTH_USER,
           pass: process.env.AUTH_PASS
        }
    }));
    const message = {
        from: '',
        // Sender address
        to: 'iyaalamiestates@gmail.com, iyaalami@gmail.com',  
       // name: req.body.name,       // List of recipients
        subject: 'Message from iyaalamiestates.com', // Subject line
  //  text: req.body.email +   + req.body.number + req.body.name +" " + req.body.message // Plain text body
        text: `${req.body.name} \n email: ${req.body.email} \n Number: ${req.body.number} \n says: ${req.body.message}`

    };
    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
    req.flash('message', 'Thank you for your email.')
    res.redirect('index');
});

router.get('/FAQ', (req, res)=>{
    res.render('FAQ');
})
module.exports = router;