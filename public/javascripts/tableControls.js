console.log('Loaded tableControls.js');


$(function() {
  var $table = $('#table')
  var $reset = $('#reset')
  var $filter = $('#filter')
  var $export = $('#export')


  $table.bootstrapTable({
    exportDataType: $(this).val(),
    exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf']
  });
  $reset.click(function () {
    $('input').val(''); // clear all search boxes
    $table.bootstrapTable('refresh')
    bindRowsEvent()
  })

  // send DB call to fetch filtered results
  $filter.click(function(){
    $table.bootstrapTable('refresh')
  })

  $export.click(function(){
    $table.bootstrapTable('export');
  })

 
  
  // Filter table on keyup
  // $('input').on('keyup', function(e,args){
  //   var txt = $(e.currentTarget)[0].value;
  //   var id = $(e.currentTarget)[0].id;
  //   txt = txt.toUpperCase();
  //   console.log('txt',txt);
  //   if(txt.length === 0){
  //     $table.bootstrapTable('filterBy', {}) // reset table filter
  //   } else {
  //     $table.bootstrapTable('filterBy', {
  //       [id]: txt
  //     })
  //   }
  //   bindRowsEvent()
  // })

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

function ajaxRequest(params) {
  var data = {};

  // format times
  var prod_time = $('#cb_prod_time')[0].value ? $('#cb_prod_time')[0].value + ":00" : null;
  var prod_time2 = $('#cb_prod_time2')[0].value ? $('#cb_prod_time2')[0].value + ":00" : null;

  data.cb_year_code = $('#cb_year_code')[0].value || null;
  data.cb_year_code2 = $('#cb_year_code2')[0].value || null;
  data.cb_plant_code = $('#cb_plant_code')[0].value || null;
  data.cb_plant_code = $('#cb_plant_code2')[0].value || null;
  data.cb_day_code = $('#cb_day_code')[0].value || null;
  data.cb_day_code2 = $('#cb_day_code2')[0].value || null;
  data.cb_prod_date = $('#cb_prod_date')[0].value || null;
  data.cb_prod_date2 = $('#cb_prod_date2')[0].value || null;
  data.cb_prod_time = prod_time;
  data.cb_prod_time2 = prod_time2;
  data.cb_pallet = $('#cb_pallet')[0].value || null;
  data.cb_pallet = $('#cb_pallet2')[0].value || null;
  data.cb_block = $('#cb_block')[0].value || null;
  data.cb_block = $('#cb_block2')[0].value || null;
  data.cb_pass_fail = $('#cb_pass_fail')[0].value || null;

  console.log('filter-data',data);
    
  var req = $.post("/cheese/filter", data);
  //define success callback
  req.done(function(response){
    console.log('filtered response',response);
    params.success(response);
    $('#row-count')[0].innerText = response.length;
    bindRowsEvent();
  });
  //define fail callback
  req.fail(function(err){
    console.log('filtering error',err);
    alert('Error filtering results',err);
  })
}