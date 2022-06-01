const express = require('express');
const router = express.Router();
const listing = require('../models/listingdb');
const mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

//show file to web
router.get('/singlelisting/:id', (req, res) => {
    listing.aggregate([
        {$match: {'_id': ObjectId(req.params.id)}},
        {
            $project: {
               features: { $split: ["$features", ","] },
                'projectName': 1,
                'address': 1,
                'price': 1,
                'description': 1,
                'city': 1,
                'district': 1,
                'situation': 1,
                image: { $arrayElemAt: [ "$image", 0 ] },
                      // 'image': 1,
                'date': 1,
                _id: 1
            }
        },
   
    ],
    function(err, list) {
        if (err) {

        } else {
           // console.log(list[0].features[0]);

            res.render('singlelisting', {list:list});
        }

   // }
});

});


router.get('/listgallery', (req, res) => {
    listing.aggregate([
        { $match: { 'status': 'Now-Selling' } },

        {
            $project: {
                features: { $split: ["$features", ","] },
                'projectName': 1,
                'address': 1,
                'price': 1,
                'status': 1,
                'description': 1,
                'city': 1,
                'state': 1,
                'units':1,
                image: { $arrayElemAt: [ "$image", 0 ] },
                      // 'image': 1,
                'date': 1,
                _id: 1
            }
        },
   
    ],
    function(err, docs) {
        if (err) {

        } else {
            //console.log(docs[0].features[0]);

            res.render('listgallery', { docs: docs });
        }

    }
    );


});

router.get('/propertyListing/:_id', (req, res)=>{
    listing.aggregate([
        { $match: {'district': req.body.district,  'available': 'Yes' } },

        {
            $project: {
                features: { $split: ["$features", ","] },
                'projectName': 1,
                'address': 1,
                'price': 1,
                'status': 1,
                'description': 1,
                'city': 1,
                'state': 1,
                image: { $arrayElemAt: [ "$image", 0 ] },
               // 'image': 1,
                'date': 1,
                _id: 1
            }
        },
   
    ],
    function(err, docs) {
        if (err) {
            console.log(docs[0].address  +'image' +req.body.district +'propertyerror');

        } else {
           // console.log(docs[0] +'image' +req.params.district +'property');

            res.render('propertyListing', {docs:docs});
        }

    }
    );
});

router.get('/property', (req, res)=>{
    listing.aggregate([
        
   {$group:{_id:'$district', image:{$first:{ $arrayElemAt: [ "$image", 0 ] }}}},
  
     {
         $project:{
             _id: 1,
             image:1,
          //  type:1
                      
          }
      }
      

   
    ],
    function(err, docs) {
        if (err) {

        } else {
          //  console.log(docs[0]+ 'here');

           res.render('property', { docs: docs });
        }

    }
    );
   // res.render('property');
});

router.get('/landListing', (req, res)=>{
    listing.aggregate([
       // { $match: {'projectName':'Land', 'status': 'Now-Selling' } },
        { $match: {'title':'Land' } },

        {
            $project: {
               // features: { $split: ["$features", ","] },
               // 'projectName': 1,
                'address': 1,
                'price': 1,
               // 'nowSelling': 1,
                'description': 1,
                'city': 1,
                'state': 1,
                'fee':1,
                image: { $arrayElemAt: [ "$image", 0 ] },
                      // 'image': 1,
                'date': 1,
                _id: 1
            }
        },
   
    ],

    function(err, docs) {
        if (err) {

        } else {
            console.log(docs+ 'here');

           res.render('landListing', { docs: docs });
        }

    }
    );
});

router.get('/propertyGallery/:_id', (req, res)=>{

    listing.aggregate([
        {$match:{district:req.params._id, available:'Yes'}},//, 'type':req.params.type}},
       // {$unwind:'$image'},
        
        {$project: {
            image: { $arrayElemAt: [ "$image", 0 ] },
              
           price: 1,
           address:1,
            district:1,
            type:1
        }}
    ], function(err, docs) {
        if (err){

        }
        else{
           console.log(req.params.type + " type")
            res.render('propertyGallery', {docs:docs});
        }

    });
   
});

module.exports = router;