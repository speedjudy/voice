'use strict';
const [entry] = performance.getEntriesByType("navigation");
console.log(entry)

if (entry["type"] === "back_forward" || entry['type'] === "reload" || entry['type'] === "navigate") {
    initMic();
}
async function initMic() {
    if ("webkitSpeechRecognition" in window) {
        let script = document.currentScript;
        let fullUrl = script.src.replace('.js', '.css');
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            "<link rel=\"stylesheet\" href=\"" + fullUrl + "\" />");
        let final_transcript = "";
        let elemDiv = document.createElement('div');
        const location = await fetch('https://ipapi.co/json').then(function (response) {
            return response.json();
        }).then(function (data) {
            return data;
        });
        const locationValue = location?.city ? location.city : 'totonto';
        const position = document.getElementsByClassName("page-home__hero").length ?
            document.getElementsByClassName("page-home__hero")[0].getBoundingClientRect().height : screen.height / 2;
        elemDiv.innerHTML = `
                <div class="boxMic" style="top: ${(position)}px">
                        <div class="objectMic">
                            <div class="outlineMic" id="outlineMic">
                            </div>
                            <div class="outlineMic" id="delayedMic">
                            </div>
                            <div class="buttonMic">
                            </div>
                            <div class="buttonMic" id="circleinMic">
                                <svg class="mic-iconMic" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve" style="fill:#1E2D70;">
                <g><path d="M500,683.8c84.6,0,153.1-68.6,153.1-153.1V163.1C653.1,78.6,584.6,10,500,10c-84.6,0-153.1,68.6-153.1,153.1v367.5C346.9,615.2,415.4,683.8,500,683.8z M714.4,438.8v91.9C714.4,649,618.4,745,500,745c-118.4,0-214.4-96-214.4-214.4v-91.9h-61.3v91.9c0,141.9,107.2,258.7,245,273.9v124.2H346.9V990h306.3v-61.3H530.6V804.5c137.8-15.2,245-132.1,245-273.9v-91.9H714.4z"></path></g>
                </svg>
                            </div>
                        </div>
                </div>
                <div id="toptooltip" class="tooltip" role="tooltip">
                Start Your Voice Search
                    <div class="arrow" data-popper-arrow></div>
                </div>
                <div id="bottomtooltip" class="tooltip" role="tooltip">
                    <div class="arrow" data-popper-arrow></div>
                    Say: 1 Bedroom rentals under 3,000 in CityName
                </div>
                `;
        let elemDivText = document.createElement('div');
        elemDivText.innerHTML = '<div class="textDivMic">' +
            '<span id="textResultUjjal"></span></div>'
        document.body.appendChild(elemDiv);
        document.body.appendChild(elemDivText);

        const tooltip = document.querySelector('#toptooltip');
        Popper.createPopper(document.querySelector('.boxMic'), tooltip, {
            placement: 'top',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 70],
                    },
                },
            ],
        });
        Popper.createPopper(document.querySelector('.boxMic'), bottomtooltip, {
            placement: 'bottom',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 70],
                    },
                },
            ],
        });

        let speechRecognition = new webkitSpeechRecognition();
        speechRecognition.lang = "en-GB";
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.onstart = () => {
            document.getElementById('textResultUjjal').innerText = "";
            // document.getElementById('pidsWrapper').style.display = "none";
            document.getElementById('outlineMic').style.animation = "pulseMic 2s infinite"
            document.getElementById('outlineMic').style.animation = "pulseMic 3s infinite"
            setTimeout(() => {
                speechRecognition.stop();
            }, 10000)

        };

        async function matchedLogic() {
            if (final_transcript.length === 0) {
                final_transcript = "apartment"
            }
            const response = await fetch('https://kz5l9o5qci.execute-api.us-east-1.amazonaws.com/' + encodeURI(final_transcript) + '/' + encodeURI(locationValue));
            const responseJson = await response.json();
            if (responseJson.status) {
                window.open(responseJson.url, "_self");
                const matchedWords = responseJson.matching_word;
                let final_transcript_color = final_transcript
                matchedWords.map(el => {
                    let key = Object.keys(el)[0]
                    if (final_transcript.toLowerCase().includes(key)) {
                        let color = 'red';
                        if (el[key] === 'location') {
                            color = 'red'
                        } else if (el[key] === 'bathroom' || el[key] === 'bedroom' || el[key] === 'park') {
                            color = 'darkslateblue'
                        } else if (el[key] === 'amenities') {
                            color = 'blue'
                        } else if (el[key] === 'filters') {
                            color = 'violet'
                        } else if (el[key] === 'category') {
                            color = 'green'
                        } else if (el[key] === 'floor') {
                            color = 'skyblue'
                        } else if (el[key] === 'type') {
                            color = 'darkgreen'
                        } else if (el[key] === 'available') {
                            color = 'darkblue'
                        }
                        final_transcript_color = final_transcript_color.toLowerCase().replace(key, '<span style="color: ' + color + ';">' + key[0].toUpperCase() + key.slice(1) + '</span>')
                    }
                });
                document.getElementById('textResultUjjal').innerHTML = final_transcript_color;
            }
        }

        speechRecognition.onend = () => {
            document.getElementById('outlineMic').style.animation = ""
            document.getElementById('outlineMic').style.animation = ""
            // document.getElementById('pidsWrapper').style.display = "none";
            setTimeout(matchedLogic, 500);
        };
        speechRecognition.onresult = (event) => {
            var interim_transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            console.log("interim_transcript", interim_transcript);
            console.log("final_transcript", final_transcript);
            document.getElementById('textResultUjjal').innerText = interim_transcript;
            document.getElementById('textResultUjjal').innerText = final_transcript;
            matchedLogic();
        };
        // Set the onClick property of the start button
        document.querySelector("#circleinMic").onclick = () => {
            document.getElementById('textResultUjjal').value = "";
            final_transcript = "";
            document.getElementById('toptooltip').style.display = "none";
            document.getElementById('bottomtooltip').style.display = "none";
            speechRecognition.start();
        };
    } else {
        console.log("Speech Recognition Not Available")
    }



    document.addEventListener("DOMContentLoaded", function () {
        // create a new container div element with id "container"
        var container = document.createElement("div");
        container.id = "canvas-container";

        // create a new canvas element
        var canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 400;
        canvas.id = "canvas";

        // create a new audio element
        var audio = document.createElement("audio");
        audio.id = "audio";
        audio.src = "";
        audio.controls = false;

        // append the canvas and audio elements to the container element
        container.appendChild(canvas);
        container.appendChild(audio);

        // set the CSS styles for the container, canvas, and audio elements
        var css = `
          a {
              text-decoration: none;
          }
            #canvas-container {
              position: fixed;
              top: 50%;
              left: 50%;
              width: 100vw;
              height: 100vh;        
              display: flex;
              transform: translate(-50%, -50%);
              z-index:99998;
              justify-content: center;
              align-items: center;
              pointer-events: none;
              
            }
            canvas {
              display: block;
              margin: 0 auto;
              z-index:99999;
              pointer-events: none;
            }
            audio {
              display: block;
              margin: 0 auto;
            }
      
            #canvas-container .logo_img{
              z-index: 9999999;
              pointer-events: auto;
            }      
      
            #canvas-container .logo_imgx{
              border-radius: 50%;
              display: block;
              margin: auto;
              z-index: 9999999;
              pointer-events: auto;
              https://www.tailorbrands.com/wp-content/uploads/2020/07/mcdonalds-logo.jpg
            }
            
            #container-config {
              position: absolute;
              bottom: 0;
              width: 100%;
              display: flex;
              flex: 0 0 100%;
              background-color: #f1f3f4;
            }
            #container-config #fullscreen{
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            #container-config #audio{
              flex: 1;
            }
            .config{
                background-color: white;
                margin-top: 8px;
            }
            .config> div {
              padding: 10px;
              border-top: 1px solid black;
            }
            .config div label {
              font-weight: 500 !important;
              display: block;
            }
      
      
          `;

        // create a new style element and add the CSS code to it
        var style = document.createElement("style");
        style.type = "text/css";
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        // append the style and container elements to the HTML document
        document.head.appendChild(style);
        document.body.appendChild(container);

        // TUNING PERFORMANCE
        var audio1;
        var worker;
        var canvas = document.getElementById("canvas");
        var audioEl = document.getElementById("audio");
        var container = document.getElementById("canvas-container");
        var local_stream = null;
        var source = null;
        var audioCtx = null;

        const normalize = (val, threshold = 200) =>
            val > threshold ? val - threshold : 0;
        const normalize1 = (val, max, min) => (val - min) / (max - min);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var defaultState = {
            radius: 60, //because logo width is 120px
            //color: '#00BFFF',
            color: "#257789",
            showParticles: false,
            displayType: 0,
            bufferLength: 110,
            //fftSize: 2**14,
            fftSize: 2 ** 14,
            //bounceMultiplier: 250,
            bounceMultiplier: 0,
            beatDetection: false,
            bounce: 0,
        };

        if (!navigator.getUserMedia)
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

        var config = { ...defaultState };

        function getMedia() {
            return new Promise((resolve, reject) => {
                if (navigator.getUserMedia) {
                    // local_stream.getAudioTracks()[0].enabled = true;
                    navigator.getUserMedia(
                        { audio: true },
                        function (stream) {
                            resolve(stream);
                        },
                        function (e) {
                            console.log("Error capturing audio.");
                            reject(e);
                        }
                    );
                }
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices
                        .getUserMedia({ audio: true })
                        .then(function (stream) {
                            resolve(stream);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                }
            });
        }

        /**/
        async function listen_audio() {
            try {
                const stream = await getMedia();

                local_stream = stream;
                url = local_stream;
                audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // for safari browser // I need to explain the browser restrictions & CORS issues here
                if (!worker) {
                    worker = true;
                    placeParticles();
                    return true;
                }
            } catch (e) {
                local_stream = null;
                return false;
            }

        }
        container.style.cursor = "none";

        const bufferLength = defaultState.bufferLength;
        const dataArray = new Uint8Array(bufferLength); // coverting to unsigned 8-bit integer array format because that's the format we need
        let analyser = null;

        function animate() {
            if (!local_stream || mobileCheck()) return;
            var url = local_stream;
            audioEl.src = "";

            if (!analyser) {
                let source = audioCtx.createMediaStreamSource(url);
                analyser = audioCtx.createAnalyser();
                source.connect(analyser);
            }

            analyser.fftSize = defaultState.fftSize; // controls the size of the FFT. The FFT is a fast fourier transform. Basically the number of sound samples. Will be used to draw bars in the canvas

            analyser.getByteFrequencyData(dataArray);

            const setBounce = () => {
                let max = Math.max(...dataArray.slice(0, config.bufferLength / 2));
                let bounce = normalize1(max, 255, 0);
                let bounced =
                    defaultState.radius +
                    Math.floor(bounce * defaultState.bounceMultiplier);
                let height =
                    bounced * 2 > window.innerHeight ? window.innerHeight / 2 : bounced;
                let width =
                    bounced * 2 > window.innerWidth ? window.innerWidth / 2 : bounced;

                config.radius = Math.min(height, width);
                config.bounce = bounce;
            };

            const setLogo = () => {
                let logoExists = container.querySelector(".logo_img");
                if (logoExists) {
                    logoExists.height = config.radius * 2;
                    logoExists.width = config.radius * 2;
                }
            };

            setBounce();
            drawVisualizer({ bufferLength, dataArray, config });
            drawStars({ bufferLength, dataArray, config });
            setTimeout(setLogo, 250);
            requestAnimationFrame(animate); // calls the animate function again. This method is built in
        }

        //logo
        function load_logo() {
            const buttonMic = document.createElement("div");
            // set the styles of the outer div
            buttonMic.id = "mic-logo";
            buttonMic.style.width = "120px";
            buttonMic.style.height = "120px";
            buttonMic.style.borderRadius = "50%";
            buttonMic.style.background = "#2F91A7";
            buttonMic.style.boxShadow = "0px 0px 80px #ffffff";
            buttonMic.style.position = "absolute";
            buttonMic.style.display = "flex";
            buttonMic.style.justifyContent = "center";
            buttonMic.style.alignItems = "center";
            buttonMic.style.top = getYPositionOfLogo() + 'px';

            speechRecognition.onstart = function () {
                console.log("Start Speech Recognigion");
                overlay.style.display = "block";
                overlay.click();
                positionOverlay();

                if (!visualAnimationStarted) {
                    animate();
                    visualAnimationStarted = true;
                }

                speechOutput.innerHTML = "";

                setTimeout(() => {
                    speechRecognition.stop();
                    console.log("Stop Speech Recognigion");
                }, 10000);
            };

            buttonMic.addEventListener("click", async function () {
                if (!isListening) {
                    isListening = true;
                    const is_avail = await listen_audio();
                    if (is_avail) {
                        speechRecognition.start();
                    } else {
                        isListening = false;
                    }

                } else {
                    isListening = false;
                    speechRecognition.stop();
                }
            });

            // create a new div element to be added as a child of the outer div
            const circleInMic = document.createElement("div");
            circleInMic.id = "circleinMic";
            circleInMic.style.width = "100px";
            circleInMic.style.height = "100px";
            circleInMic.style.borderRadius = "50%";
            circleInMic.style.background = "#f6f8f9";
            circleInMic.style.boxShadow = "0px -2px 15px #2f91a7";
            circleInMic.style.display = "flex";
            circleInMic.style.justifyContent = "center";
            circleInMic.style.alignItems = "center";
            circleInMic.style.cursor = "pointer";

            // create the SVG element
            const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgEl.setAttribute("class", "mic-iconMic");
            svgEl.setAttribute("version", "1.1");
            svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgEl.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
            svgEl.setAttribute("x", "0px");
            svgEl.setAttribute("y", "0px");
            svgEl.setAttribute("viewBox", "0 0 1000 1000");
            svgEl.setAttribute("enable-background", "new 0 0 1000 1000");
            svgEl.setAttribute("xml:space", "preserve");
            svgEl.style.fill = "#1E2D70";
            svgEl.style.height = "60px";
            svgEl.style.margin = "21px";

            // create the path element
            const pathEl = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );
            pathEl.setAttribute(
                "d",
                "M500,683.8c84.6,0,153.1-68.6,153.1-153.1V163.1C653.1,78.6,584.6,10,500,10c-84.6,0-153.1,68.6-153.1,153.1v367.5C346.9,615.2,415.4,683.8,500,683.8z M714.4,438.8v91.9C714.4,649,618.4,745,500,745c-118.4,0-214.4-96-214.4-214.4v-91.9h-61.3v91.9c0,141.9,107.2,258.7,245,273.9v124.2H346.9V990h306.3v-61.3H530.6V804.5c137.8-15.2,245-132.1,245-273.9v-91.9H714.4z"
            );

            svgEl.appendChild(pathEl);
            circleInMic.appendChild(svgEl);
            buttonMic.appendChild(circleInMic);

            buttonMic.classList.add("logo_img");

            let logoExists = container.querySelector(".logo_img");

            if (logoExists) {
                container.removeChild(logoExists);
                console.log("logo removed");
            }
            container.appendChild(buttonMic);

            var instanceTipp = tippy("#mic-logo", {
                animation: "bounce",
                content: "<strong>Start Your Voice Search</strong>",
                allowHTML: true,
                trigger: "manual",
                showOnCreate: true,
                placement: "top",
            })
            var instanceTipp2 = tippy("#mic-logo", {
                animation: "bounce",
                content: "<strong>Say: 1 Bedroom rentals under 3,000 in CityName</strong>",
                allowHTML: true,
                trigger: "manual",
                showOnCreate: true,
                placement: "bottom",
            }
            );
        }

        load_logo();

        window.addEventListener("resize", () => {
            if (worker) {
                let height =
                    defaultState.radius * 2 > window.innerHeight
                        ? window.innerHeight / 2
                        : defaultState.radius;
                let width =
                    defaultState.radius * 2 > window.innerWidth
                        ? window.innerWidth / 2
                        : defaultState.radius;
                config.radius = Math.min(height, width);
                let resize_canvas = [window.innerWidth, window.innerHeight];
                maxDistributionX = window.innerWidth / 8;
                maxDistributionY = window.innerHeight / 4;
            }
        });
    });
}