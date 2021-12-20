console.log('Loaded tableControls.js');


$(function() {
  var $table = $('#table')
  var $clear = $('#clear')
  var $filter = $('#filter')
  var $export = $('#export')
  var $sort = $('#sort')
  var $next = $('#next-btn')
  var $prev = $('#prev-btn')


  $table.bootstrapTable({
    exportDataType: $(this).val(),
    exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
    showExport: 'true'
  });
  $clear.click(function () {
    $('input[type="text"]').val(''); // clear all search boxes
    $('input[type="checkbox"]').prop('checked',false);
    $('#criteria1').val('');
    $('#criteria2').val('');
    $('#criteria3').val('');
    $('#criteria4').val('');
    $table.bootstrapTable('refresh')
    bindRowsEvent()
  })

  // send DB call to fetch filtered results
  $filter.click(function(){
    $table.bootstrapTable('refresh')
  })

  $export.click(function(){
    $table.tableExport({type:'csv'});
  })

  $sort.click(function(){
    $('#sortModal').modal("show")
  })

  $next.click(function(){
    var index = parseInt(window.selected_index);
    index = index + 1;
    $('#myModal').modal("hide");
    var row = $('#table tr[data-index="'+index+'"]');
    grabRowData(row,index);
    window.selected_index = index;
    $('#myModal').modal("show");
  })

  $prev.click(function(){
    var index = parseInt(window.selected_index);
    index = index - 1;
    $('#myModal').modal("hide");
    var row = $('#table tr[data-index="'+index+'"]');
    grabRowData(row,index);
    window.selected_index = index;
    $('#myModal').modal("show");
  })


  function grabRowData(row,index){
    window.modal_data = {
      yearCode: $(row).find('td')[0].innerText,
      plantCode: $(row).find('td')[1].innerText,
      dayNum: $(row).find('td')[2].innerText,
      pallet: $(row).find('td')[3].innerText,
      block: $(row).find('td')[4].innerText,
      prodDate: $(row).find('td')[5].innerText,
      prodTime: $(row).find('td')[6].innerText,
      passFail: $(row).find('td')[7].innerText,
      cb_id: window.response[index]["cb_id"]
    };
  }
 
  
  // Filter table on keyup
  // $('input').on('keyup', function(e,args){
  //   var txt = $(e.currentTarget)[0].value;
  //   var id = $(e.currentTarget)[0].id;
  //   txt = txt.toUpperCase();
  //   console.log('txt',txt);
  //   if(txt.length === 0){
  //     $table.bootstrapTable('filterBy', {}) // clear table filter
  //   } else {
  //     $table.bootstrapTable('filterBy', {
  //       [id]: txt
  //     })
  //   }
  //   bindRowsEvent()
  // })

  bindRowsEvent();

  $('#myModal').on('hide.bs.modal', function (event) {
    window.selected_index = null;
  })

  $('#myModal').on('show.bs.modal', function (event) {
    console.log(window.modal_data);
    var data = window.modal_data;
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('Cheese Block');
    modal.find('.modal-body #year-code').text(data.yearCode);
    modal.find('.modal-body #plant-code').text(data.plantCode);
    modal.find('.modal-body #day-number').text(data.dayNum);
    modal.find('.modal-body #prod-date').text(data.prodDate);
    modal.find('.modal-body #prod-time').text(data.prodTime);
    modal.find('.modal-body #pallet').text(data.pallet);
    modal.find('.modal-body #block').text(data.block);
    modal.find('.modal-body #pass-fail').text(data.passFail);
    

    // fetch image
    var req = $.post("/cheese/image", {cb_id: data["cb_id"]});
  //define success callback
  req.done(function(response){
    console.log('image response',response);
    var d = new Date();
    modal.find('.modal-body #cheese-img').attr('src','/images/cheese_block.jpg?'+d.getTime());
    // modal.find('.modal-body #cheese-img').attr('src','/images/test.jpg');
  });
  //define fail callback
  req.fail(function(err){
    console.log('fetch image error:',err);
    alert('Error fetching image:',err);
  })
  })
})

function bindRowsEvent(){
  setTimeout(function(){
    $('#table tr').off('click');
    $('#table tr').on('click',function(e){
      var row = $(e.currentTarget)[0];
      var index = $(row).attr('data-index');
      window.selected_index = index;
      window.modal_data = {
        yearCode: $(row).find('td')[0].innerText,
        plantCode: $(row).find('td')[1].innerText,
        dayNum: $(row).find('td')[2].innerText,
        pallet: $(row).find('td')[3].innerText,
        block: $(row).find('td')[4].innerText,
        prodDate: $(row).find('td')[5].innerText,
        prodTime: $(row).find('td')[6].innerText,
        passFail: $(row).find('td')[7].innerText,
        cb_id: window.response[index]["cb_id"]
      };

      // fetch image
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

  data.cb_year_code_n = $('#cb_year_code_n')[0].checked ? "Y" : null;
  data.cb_year_code = $('#cb_year_code')[0].value || null;
  data.cb_year_code2 = $('#cb_year_code2')[0].value || null;

  data.cb_plant_code_n = $('#cb_plant_code_n')[0].checked ? "Y" : null;
  data.cb_plant_code = $('#cb_plant_code')[0].value || null;
  data.cb_plant_code2 = $('#cb_plant_code2')[0].value || null;

  data.cb_day_code_n = $('#cb_day_code_n')[0].checked ? "Y" : null;
  data.cb_day_code = $('#cb_day_code')[0].value || null;
  data.cb_day_code2 = $('#cb_day_code2')[0].value || null;

  data.cb_prod_date_n = $('#cb_prod_date_n')[0].checked ? "Y" : null;
  data.cb_prod_date = $('#cb_prod_date')[0].value || null;
  data.cb_prod_date2 = $('#cb_prod_date2')[0].value || null;

  data.cb_prod_time_n = $('#cb_prod_time_n')[0].checked ? "Y" : null;
  data.cb_prod_time = prod_time;
  data.cb_prod_time2 = prod_time2;

  data.cb_pallet_n = $('#cb_pallet_n')[0].checked ? "Y" : null;
  data.cb_pallet = $('#cb_pallet')[0].value || null;
  data.cb_pallet2 = $('#cb_pallet2')[0].value || null;

  data.cb_block_n = $('#cb_block_n')[0].checked ? "Y" : null;
  data.cb_block = $('#cb_block')[0].value || null;
  data.cb_block2 = $('#cb_block2')[0].value || null;

  data.cb_pass_fail_n = $('#cb_pass_fail_n')[0].checked ? "Y" : null;
  data.cb_pass_fail = $('#cb_pass_fail')[0].value || null;

  var orderString = [];
  if($('#criteria1').val() !== ''){
    var str = $('#criteria1').val();
    if($('#criteria1-order').val() == 1){
      str += ' desc';
    }
    orderString.push(str);
  }
  if($('#criteria2').val() !== ''){
    var str = $('#criteria2').val();
    if($('#criteria2-order').val() == 1){
      str += ' desc';
    }
    orderString.push(str)
  }
  if($('#criteria3').val() !== ''){
    var str = $('#criteria3').val();
    if($('#criteria3-order').val() == 1){
      str += ' desc';
    }
    orderString.push(str)
  }
  if($('#criteria4').val() !== ''){
    var str = $('#criteria4').val();
    if($('#criteria4-order').val() == 1){
      str += ' desc';
    }
    orderString.push(str)
  }
  orderString = orderString.join(',');

  data.order_by = orderString;
  console.log('orderString', orderString);

  console.log('filter-data',data);
    
  var req = $.post("/cheese/filter", data);
  //define success callback
  req.done(function(response){
    console.log('filtered response',response);
    params.success(response);
    window.response = response;
    $('#row-count')[0].innerText = response.length;
    bindRowsEvent();
  });
  //define fail callback
  req.fail(function(err){
    console.log('filtering error',err);
    alert('Error filtering results',err);
  })
}