// $(document).ready(function(){
//  		$('#business').on('submit', (e) => {
//  					const search = $('#business input').val();
//                     e.preventDefault();

// 					var data = {};
// 					data.title = search;
					
// 					$.ajax({
// 						type: 'POST',
// 						data: JSON.stringify(data),
// 				        contentType: 'application/json',
//                         url: 'http://localhost:3000/business/search',						
//                         success: function(data) {
//                             console.log('success');
//                             console.log(JSON.stringify(data));
//                         }
//                     });
//                 });				
// });