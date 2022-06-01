//console.log('getting ready to get value selected');
//var theList;
//var j=0;
//get selected value 
list1=document.getElementById('status');

//pool data from db
list1.addEventListener('change', function(e){
    fetch('/admin/getData',{method:'GET'})
    .then(function(response){
        if(response.ok)
       // var arr = list1.value.split("-");
        console.log(list1.value +"here" );
      
        return response.json();
        //throw new Error('Request failed.');
})
.then(function(data) {
//use data to pupulate second dropdown
var  getNames =  data.filter(function(getName) {
//console.log(getName);
//var arr = list1.value.split("-");
if(getName.criteria == list1.value){
    // if(data.address == list1.value){
      //   var getT="try";
       //  console.log("true" + getName.address);
       var select = document.getElementById("description");
       select.value=  getName.description;

       var description = document.getElementById("address");
       description.value=  getName.address;

       var city = document.getElementById("city");
       city.value= getName.city;

       var state = document.getElementById("state");
       state.value= getName.state;

       var projectName = document.getElementById("projectName");
       projectName.value=  getName.projectName;

       var units = document.getElementById("units");
       units.value= getName.units;
     
         //select.appendChild("lot");
         //var select = data.district;
}
      return getName.criteria == list1.value;
    // console.log(data);
   
      
        // }
    });
  /*  if(getName.address == list1.value){
  // if(data.address == list1.value){
       var getT="try";
       console.log("true" + getName.address);
     var select = document.getElementById("district");
     select.value+= select.value + getT;
       //select.appendChild("lot");
       //var select = data.district;


   }*/
    //console.log(getNames); 
  //  var select = document.getElementById("district");

    //select.appendChild('district');
   //second dropdown population right here
    //for(i=0; i<getNames.length; i++){
      //var option = document.getElementById('option');
   //   option.text = option.value = getNames[i].name;
    // select.appendChild(getNames[i].district);
  // }

//console.log(data.address );
})

.catch(function(error) {
console.log(error);
});

});

