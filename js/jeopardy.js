var game = {}
game.init = function() {
    if (game.gamedata == null) {
        return;
    }

    $('#game').fadeIn(1000);
    $('#options').hide();
    $('#stats').show();
    game.team_cnt = $('#teams').val()
    game.createScoreboard()
    game.current_points = 0;
}

game.createScoreboard = function() {
	var content = "<table cellspacing=10><tbody><tr>";
	for(var i = 1; i <= game.team_cnt; i++) {
		content += "<th><h3>Team " + i + "</h3></th>";
	}
	content += "</tr><tr>";
	for(var i = 1; i <= game.team_cnt; i++) {
		content += "<td><h3 id='team" + i +"'>0</h3><input class='add-points' onclick='game.addPoints(" + i +  ")' value='+' type='button' /> <input class='subtract-points' onclick='game.subtractPoints(" + i +  ")' type='button' value='-' /></td>";
	}
	content += "</tr></tbody></table>";
	$('#stats').html(content);
}

game.addPoints = function(team) {
	game.updatePoints(team, game.current_points);
}

game.subtractPoints = function(team) {
	var points = 0-game.current_points;
	game.updatePoints(team, points);
}

game.updatePoints = function (team, diff) {
    var points = parseInt($('#team' + team).html()) + diff;

    $('#team' + team).html(points);
	$('#' + game.current_questionID).addClass("dirty")
	    .unbind('mouseover')
	    .unbind('mouseout');
}

$(document).ready(function() {
    $('tbody tr td').each(function() {
        $(this).addClass('cell')
               .addClass('clean')
               .click(function() {
            prompt.show($(this));
        });
    });

	$('textarea.edit').autogrow();

	$('textarea.edit').focus(function(){
		$(this).addClass('active');
		var val = $(this).val();
		if(val == "Enter Category" || val == "Enter Title")
			this.select();
	})

	$('textarea.edit').blur(function(){
		$(this).removeClass('active');
	})	

	$('.clean').mouseover(function(){
		$(this).addClass('ie-hack')
	})

	$('.clean').mouseout(function(){
		$(this).removeClass('ie-hack')
	})

    $('#fileinput').change(function () {
        loadFile(function(e) {
            var data = $.parseJSON(e.target.result);
            $('#title').html(data["name"]);
            $('#gametitle').html(data["name"]);
            $('thead').find('th:not(#gametitle)').each(function () {
                var id = $(this).attr("id");
                var label = data[id]["name"];
                $(this).html(label)
            });
            game.gamedata = data;
        });
    });
});

var modal = {}
modal.show = function(questionID) {
	modal.activeID = questionID;
	$('#question').val($('#' + questionID).val());
	$('#answer').val($('#a' + questionID).val());
	$('#modal').modal({"overlayClose" : true});
	$('#' + questionID).addClass("dirty").removeClass("clean")
}

modal.save = function() {
	$('#' + modal.activeID).val($('#question').val())
	$('#a' + modal.activeID).val($('#answer').val())
}

function loadFile(onload) {
    if (typeof window.FileReader !== 'function') {
      return;
    }

    var input = document.getElementById('fileinput');
    if (input && input.files && input.files[0]) {
      var fr = new FileReader();
      fr.onload = onload;
      fr.readAsText(input.files[0]);
    }
}

var prompt = {}
prompt.show = function(field) {
	game.current_points = parseInt(field.find('h3').text());
	game.current_questionID = field.attr("id");
    var column = game.current_questionID.substring(0, 2);
    var dataset = game.gamedata[column][game.current_questionID];
	$('#question').hide();
	$('#game').hide();
	$('#prompt').fadeIn(1000);
	$('#answer').html(dataset['question']);
	$('#question').html(dataset['answer']);
	if($('#question').html().length == 0)
		$('#correct-response').hide();
	else
		$('#correct-response').show();
}

prompt.hide = function() {
	$('#prompt').hide();
	$('#game').show();
}

prompt.showQuestion = function() {
	$('#question').fadeIn(1000)
}
