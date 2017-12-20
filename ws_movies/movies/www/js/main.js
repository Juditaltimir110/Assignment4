db = null;
function init(){
	
    movieList();
	db = window.sqlitePlugin.openDatabase({name: 'listoffav.db', location: 'default'});
   
   
   db.sqlBatch([
   'CREATE TABLE IF NOT EXISTS listoffav (id, title, releaseDate, voteAverage, posterPath, overview)'/*,
   [ 'INSERT INTO listoffav VALUES (?,?)', ['It', '346364'] ],
   [ 'INSERT INTO listoffav VALUES (?,?)', ['Jumanji', '8844'] ]*/
   ], function() {
	   console.log('Populated database OK');
	   alert("Table created successfully");
   }, function(error) {
	   console.log('SQL batch ERROR: ' + error.message);
	   alert("Error occurred while creating the table.");
   }); 
   
   
    
/*
	document.getElementById("submit").addEventListener("click", newfav, false);
	db = window.sqlitePlugin.openDatabase({ name: 'schedule.db', location: 'default' }, function (db) {

	    db.transaction(function (tx) {
	    
	    tx.executeSql('CREATE TABLE appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, original_title TEXT, id TEXT)');
		}, function (error) {
		    alert('transaction error: ' + error.message);
		}, function () {
		    alert('transaction ok');
		});

	}, function (error) {
		 alert('Open database ERROR: ' + JSON.stringify(error));
	});	*/
	
	//END BD
	
	document.getElementById("submit").onclick = insertDb;
	//db.transaction(insertDb);
}


function insertDb(id){
	var request = $.ajax({
		url: "https://api.themoviedb.org/3/movie/"+id+"?api_key=86ae5f446fac9cdaf282f2360c5a313b",
        method: "GET"
    });
	
     request.done(function( result ) {
         alert('Added to Favorites');
         db.sqlBatch([
                [ 'INSERT INTO listoffav VALUES (?, ?, ?, ?, ?, ?)', [result.id, result.original_title, result.release_date, result.vote_average, result.poster_path, result.overview] ]
              ], function() {
                console.log('INSERT OK');
              }, function(error) {
                console.log('SQL batch ERROR: ' + error.message);
         });
     });
	 
	request.fail(function( jqXHR, textStatus ) {
       alert( "Request failed: " + textStatus );
    })
	 
}


/*
function delteDb(){
    db.sqlBatch([
        'delete FROM listoffav'
    ], function(){
        console.log('delete OK');
    }, function(error) {
        console.log('delete ERROR '+ error.message);
    });
}
*/

function movieListandDetails(id){
     var request = $.ajax({
         url: "https://api.themoviedb.org/3/movie/"+id+"?api_key=86ae5f446fac9cdaf282f2360c5a313b",
          method: "GET"
        });

        request.done(function( result ) {
            $.mobile.navigate( "#page2" );
            var listdetails = $("#mylistdetails");
            listdetails.empty();
            listdetails.append("<h2>"+result.original_title+"</h2><br>");
            listdetails.append("<img src=https://image.tmdb.org/t/p/w500"+result.poster_path+" height='300px'>");
            listdetails.append("<h3>Note: "+result.vote_average+"</h3>");
            listdetails.append("<p>Release date: "+result.release_date+"</p>");
            listdetails.append("<p>"+result.overview+"</p>");
            
            return result;
           
            listdetails.listview("refresh");
        });
    
        request.fail(function( jqXHR, textStatus ) {
          alert( "Request failed: " + textStatus );
    });
    
    
}

function movieList(){
    var theList = $("#mylist");
    
     var request = $.ajax({
          url: "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=86ae5f446fac9cdaf282f2360c5a313b",
          method: "GET"
        });

        request.done(function( moviesList ) {
            
            
            for (i=0;i<moviesList.results.length;i++){
                // theList.append( "<li>" + moviesList.results[i].original_title + "</li>");
                theList.append("<div class='ui-block-a'><br><img src=https://image.tmdb.org/t/p/w500"+moviesList.results[i].poster_path+" height='280'></div>");
				theList.append("<div class='ui-block-b'><br><li><a href=javascript:movieListandDetails("+moviesList.results[i].id +")>"+moviesList.results[i].original_title+"</a></li></div><br>");
				  
                }
            
            theList.listview("refresh");
            
            });

        request.fail(function( jqXHR, textStatus ) {
          alert( "Request failed: " + textStatus );
    });
}