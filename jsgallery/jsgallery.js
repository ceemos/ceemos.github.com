var autoindex = true;
if(autoindex){ // Index aus autoindex, keine Thunbnails
    $.get('./', function(data) { // Index-Seite abrufen
        var patt = /href="[^"]+\.(jpg|png)"/gi; // findet Links zu png/jpg
        var innerPatt = /[^"]+\.[^"]+/; // findet den Namen im Attribut
        var res = data.match(patt);
        var html = ''; 
        for(nr in res){
            var str = res[nr];
            var bild = str.match(innerPatt);
            html += '<img src="' + bild + '" alt ="' + bild + '"></img>';
        }
        $('.slide').html(html);
        loadall(); // den Rest ausführen
    });
} else { // Index erzeugt von PHP (mit Thumbnails)
    $(document).ready(function(){
        $('.slide').load('./jsgallery.php?type=thumbs', 0, function(){
            loadall();
        });
    });
}

function loadall() {
    
    var nr = 0;
    $('.slide img').each(function(){ // Geladene Preview-Bilder überarbeiten
        $(this).css("left", (nr * 140) + 'px');
        $(this).attr("id", nr);
        nr++;
    });
    
    var previewslen = nr * 140;
    $('.slide').width(previewslen);
    
    var bild0 = $('.slide img').attr("alt"); // 1. bild
    $('.view').html( '' // HTML für die Bild-Anzeige
        + '<a href="' + bild0 + '">'
        + '<img class="small" src="' + bild0 + '" ></img>'
        + '<img class="haupt" src="' + bild0 + '" ></img>'
        + '<img class="trans" src="' + bild0 + '" ></img>'
        + '</a>' 
    );
    
    function mousemove(e){ // das magische scrollen
        var relativeX = e.pageX - $('.preview').offset().left;
        var previewwidth =  $('.preview').width();
        var normalx = relativeX / previewwidth;
        var offset = $('.slide').position().left;
        var maxoffset = -(previewslen - previewwidth);
        var reloffset = offset / maxoffset;
        var delta = -(normalx - reloffset) * previewslen;

        var offsetneu = maxoffset * normalx;
        if((offsetneu - offset) > delta){
            offset += delta;
        } else {
            offset = offsetneu;
        }
        if(offset > 0) {
            offset = 0;
        }
        if(offset < maxoffset){
            offset = maxoffset;
        }
        $('.slide').css('left', offset + 'px'); // Bewegung anwenden
        $(this).unbind('mousemove'); // Callback trennen...
        window.setTimeout(function(){
            $('.preview').mousemove(mousemove);
        }, 100); // ... und nach 100ms wieder verbinden, damit die animation Zeit zum laufen hat 
    }
    $('.preview').mousemove(mousemove);
    
    $('.preview img').click(function() { // Bild in die Hauptanzeige holen
        var small = $(this).attr("src"); // Vorschaubild
        var bild = $(this).attr("alt"); // Name vom Bild
        $('img.small').attr("src", small); // Vorschau, schnell
        $('img.trans').remove(); // ganz altes Bild Weg
        $('img.haupt').toggleClass('front').toggleClass('haupt'); // altes Bild ganz nach vorn
        $('.view a').append('<img src="' + bild + '" class="haupt"></img>'); // neues Hauptbild
        $('img.front').toggleClass('trans').toggleClass('front'); // altes Bild ausbleichen lassen
        $('.view a').attr("href", bild); // Link aktualisieren
    });
}

// kate: space-indent on; indent-width 4; mixedindent off; indent-mode cstyle; dynamic-word-wrap on; line-numbers on;
