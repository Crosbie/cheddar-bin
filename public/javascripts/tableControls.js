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

  bindRowsEvent();

  $('#myModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = 'EOIN' // Extract info from data-* attributes
    console.log(button);
    console.log(window.modal_data);
    var data = window.modal_data;
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body #year-code').text(data.yearCode);
    modal.find('.modal-body #plant-code').text(data.plantCode);
    modal.find('.modal-body #day-number').text(data.dayNum);
    modal.find('.modal-body #prod-date').text(data.prodDate);
    modal.find('.modal-body #prod-time').text(data.prodTime);
    modal.find('.modal-body #pallet').text(data.pallet);
    modal.find('.modal-body #block').text(data.block);
    modal.find('.modal-body #pass-fail').text(data.passFail);
  })
})

function bindRowsEvent(){
  setTimeout(function(){
    $('#table tr').off('click');
    $('#table tr').on('click',function(e){
      var row = $(e.currentTarget)[0];
      window.modal_data = {
        yearCode: $(row).find('td')[0].innerText,
        plantCode: $(row).find('td')[1].innerText,
        dayNum: $(row).find('td')[2].innerText,
        prodDate: $(row).find('td')[3].innerText,
        prodTime: $(row).find('td')[4].innerText,
        pallet: $(row).find('td')[5].innerText,
        block: $(row).find('td')[6].innerText,
        passFail: $(row).find('td')[7].innerText,
      };
      console.log(row);
      $('#myModal').modal("show")
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