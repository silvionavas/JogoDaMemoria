$(document).ready(function () {
    var gameActive = false;
    var keyboardEnabled = true;
    var gameSequence = [];
    var playerSequence = [];
    var level = 1;

    function startGame() {
        gameActive = true;
        gameSequence = [];
        playerSequence = [];
        nextSequence();
        keyboardEnabled = false;
        $("h1").text("Level " + level);
    }

    function nextSequence() {
        var randomNumber = Math.floor(Math.random() * 4);
        var buttonColors = ["red", "green", "yellow", "blue"];
        var randomButtonId = buttonColors[randomNumber];
        gameSequence.push(randomButtonId);
        playSequence();
    }

    function playSequence() {
        var index = 0;
        var interval = setInterval(function () {
            var buttonId = gameSequence[index];
            playSound(buttonId);
            $("#" + buttonId).addClass("pressed");
            setTimeout(function () {
                $("#" + buttonId).removeClass("pressed");
                index++;
                if (index >= gameSequence.length) {
                    clearInterval(interval);
                    keyboardEnabled = true;
                }
            }, 500);
        }, 1000);
    }

    function playSound(buttonId) {
        var sound = new Audio("sounds/" + buttonId + ".mp3");
        sound.play();
    }

    function handleButtonClick(buttonId) {
        if (gameActive && keyboardEnabled) {
            playerSequence.push(buttonId);
            $("#" + buttonId).css("opacity", "0.3");
            setTimeout(function () {
                $("#" + buttonId).css("opacity", "1");
                checkPlayerSequence();
            }, 100);
        }
    }

    function checkPlayerSequence() {
        var lastIndex = playerSequence.length - 1;
        if (playerSequence[lastIndex] !== gameSequence[lastIndex]) {
            console.log("Perdeu");
            $("body").addClass("game-over");
            var sound = new Audio("sounds/wrong.mp3");
            sound.play();
            setTimeout(function () {
                $("body").removeClass("game-over");
            }, 100);
            $("h1").text("Game Over, Press Any Key to Restart");
            $(document).keypress(function () {
                level = 1;
                $("h1").text("Level " + level);
                startGame();
                $(document).off("keypress");
            });
            gameActive = false;
        } else {
            if (playerSequence.length === gameSequence.length) {
                playerSequence = [];
                level++;
                $("h1").text("Level " + level);
                setTimeout(nextSequence, 1000);
            }
        }
    }

    $(document).keypress(function () {
        if (!gameActive) {
            startGame();
        }
    });

    $(".btn").click(function () {
        var buttonId = $(this).attr("id");
        handleButtonClick(buttonId);
    });
});
