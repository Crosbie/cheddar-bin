console.log('Loaded tableControls.js');


$(function() {
  var $table = $('#table')
  var $button = $('#button')


  $table.bootstrapTable();
  $button.click(function () {
    $('input').val(''); // clear all search boxes
    $table.bootstrapTable('filterBy', {}) // reset table filter
    bindRowsEvent()
  })
  
  // Filter boxes
  $('input').on('keyup', function(e,args){
    var txt = $(e.currentTarget)[0].value;
    var id = $(e.currentTarget)[0].id;
    txt = txt.toUpperCase();
    console.log('txt',txt);
    if(txt.length === 0){
      $table.bootstrapTable('filterBy', {}) // reset table filter
    } else {
      $table.bootstrapTable('filterBy', {
        [id]: txt
      })
    }
    bindRowsEvent()
  })

  bindRowsEvent()
})

function bindRowsEvent(){
  setTimeout(function(){
    $('tr').on('click',function(e){
      var row = $(e.currentTarget)[0];
      console.log(row);
    })
  },1000);
  
}


// Column formatter functions
function timeFormatter(value){
  return value.split('T')[1].split('Z')[0];
}
function dateFormatter(value, row){
  var date = new Date(value).toISOString();
  date = date.split('T')[0];
  return date;
}