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
                <canvas id="canvas" width="100%" height="789" style="position:fixed; top:55px; left:-8px; display:none;"></canvas>
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
            // document.getElementById('outlineMic').style.animation = "pulseMic 2s infinite"
            // document.getElementById('outlineMic').style.animation = "pulseMic 3s infinite"
            setTimeout(() => {
                speechRecognition.stop();
            }, 10000)

        };

        // voice speech animation  start

        let isListening = false;

        // TUNING PERFORMANCE
        var audio1;
        var worker;
        var canvas = document.getElementById("canvas").transferControlToOffscreen();
        var audioEl = document.getElementById('audio')
        var container = document.getElementById('container')
        var local_stream = null
        var source = null
        var audioCtx = null
        var dataArray = null
        var bufferLength = 0
        let analyser = null;
        const normalize = (val, threshold = 200) => ((val > threshold) ? val - threshold : 0);
        const normalize1 = (val, max, min) => ((val - min) / (max - min))
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        var defaultState = {
            radius: 60,
            color: "#257789",
            showParticles: false,
            displayType: 0,
            bufferLength: 110,
            fftSize: 2 ** 14,
            //bounceMultiplier: 250,
            bounceMultiplier: 0,
            beatDetection: false,
            bounce: 0,
        }
        if (!navigator.getUserMedia)
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

        var config = { ...defaultState }


        const maxDepth = 50;
        const particleAmount = 700;
        let maxDistributionX;
        let maxDistributionY;
        const particles = new Array(particleAmount);
        const placeParticles = () => {
            for (let i = 0; i < particles.length; i += 1) {
                particles[i] = {
                    x: random(-maxDistributionX, maxDistributionX),
                    y: random(-maxDistributionY, maxDistributionY),
                    z: random(1, maxDepth),
                };
            }
        };
        const changeRange = (OldValue, NewRange, OldRange, OldMin, NewMin) => ((((OldValue - OldMin) * NewRange) / OldRange) + NewMin)
        const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
        const drawVisualizer = ({ bufferLength, dataArray, config }) => {
            // let radius = 128

            // const barWidth = canvas.width / bufferLength;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the canvas
            let max = Math.max(...dataArray.slice(0, bufferLength))
            let min = Math.min(...dataArray.slice(0, bufferLength))
            let threshold = min + (max - min) * 0.68;
            let radius = config.radius
            // ctx.translate(250, 250)
            // ctx.translate(canvas.width / 2, canvas.height / 2)
            const heightsArr = dataArray.map(el => {
                if (config.beatDetection) return normalize(el, threshold) * (radius / 80)
                else return (el * 0.4) * (radius / 80)
            })
            for (let j = 1; j <= heightsArr.length; j++) {
                heightsArr[j] = (heightsArr[(j - 1) % (heightsArr.length)] + heightsArr[j % (heightsArr.length)] + heightsArr[(j + 1) % (heightsArr.length)] + heightsArr[(j + 2) % (heightsArr.length)]) / 4
            }
            for (let i = 0; i < bufferLength; i++) {
                // const height =normalize(dataArray[i],100,0)
                // -i>0?(dataArray[i] *0.4)-i:(dataArray[i] *0.4)

                drawLine(
                    {
                        i,
                        bufferLength,
                        heightsArr,
                        radius,
                        config
                    },
                    ctx
                );
            }
        };
        const drawLine = (opts, ctx) => {
            const { i, radius, bufferLength, heightsArr, config } = opts;
            const height = heightsArr[i]
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const lineWidth = 2 * Math.PI * radius / bufferLength;
            const rads = (Math.PI * 2) / bufferLength;

            let rot = Math.ceil(changeRange(i, bufferLength, bufferLength, 0, -bufferLength / 4))
            const x = centerX + Math.cos(rads * rot) * (radius);
            const y = centerY + Math.sin(rads * rot) * (radius);
            const endX = centerX + Math.cos(rads * rot) * (radius + height);
            const endY = centerY + Math.sin(rads * rot) * (radius + height);

            // Mirror points
            // rot = changeRange(i,bufferLength, bufferLength , 0, -bufferLength/2) 

            let width = canvas.width / bufferLength;
            ctx.strokeStyle = config.color;
            ctx.fillStyle = config.color
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            switch (config.displayType) {
                case 1:
                    if (i == 0) {
                        ctx.beginPath()
                        ctx.moveTo(endX, endY)
                    }
                    ctx.lineTo(endX, endY)
                    if (i == bufferLength - 1) {
                        ctx.fill()
                    }
                    break; case 2:
                    // let width = canvas.width / bufferLength;
                    ctx.fillRect(i * width, 0, width, height)
                    break; case 3:
                    // let width = canvas.width / bufferLength;
                    if (i == 0) {
                        ctx.beginPath()
                        ctx.moveTo(0, 0)
                    }
                    ctx.lineTo(i * width, height)
                    if (i == bufferLength - 1) {
                        ctx.lineTo(canvas.width, 0)
                        ctx.fill()
                    }
                    break; case 4:
                    ctx.fillRect(i * width, centerY - height, width, height * 2)
                    break; case 5:
                    let color = ctx.fillStyle.slice(1)
                    ctx.fillStyle = `rgba(${parseInt(color.slice(0, 2), 16)},${parseInt(color.slice(2, 4), 16)},${parseInt(color.slice(4, 6), 16)},${height / 64})`
                    ctx.fillRect(i * width, 0, width, canvas.height)
                    break; case 6:
                    ctx.beginPath()
                    ctx.arc((Math.sin(rads * i) * radius * 1.5) + centerX, (Math.cos(rads * i) * radius * 1.5) + centerY, height / 2, 0, Math.PI * 2)
                    ctx.fill()
                    break; case 7:
                    ctx.beginPath()
                    ctx.arc(endX, endY, 5, 0, 10)
                    ctx.fill()
                    break; case 8:
                    for (let j = 1; j < 6; j++) {
                        ctx.beginPath()
                        ctx.arc(
                            centerX + (Math.sin(rads * i) * (height + radius) * (j / 3)),
                            centerY + (Math.cos(rads * i) * (height + radius) * (j / 3)),
                            5,
                            0,
                            10
                        )
                        ctx.fill()
                    }
                    break; case 9:
                    ctx.beginPath()
                    ctx.arc(i * width, centerY, height, 0, 10)
                    ctx.fill()
                    break; case 10:
                    ctx.beginPath()
                    ctx.moveTo(
                        centerX + Math.cos(rads * i) * (radius - height),
                        centerY + Math.sin(rads * i) * (radius - height)
                    )
                    ctx.lineTo(
                        centerX + Math.cos(rads * i) * (radius + height),
                        centerY + Math.sin(rads * i) * (radius + height)
                    )
                    ctx.stroke()
                    break; case 11:
                    if (i <= bufferLength / 2) {
                        const negx = centerX - Math.cos(rads * rot) * (radius);
                        const negy = centerY + Math.sin(rads * rot) * (radius);
                        const negendX = centerX - Math.cos(rads * rot) * (radius + heightsArr[i]);
                        const negendY = centerY + Math.sin(rads * rot) * (radius + heightsArr[i]);
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(endX, endY);
                        ctx.moveTo(negx, negy);
                        ctx.lineTo(negendX, negendY);
                        ctx.stroke();
                    }
                    break; case 12:
                    const negendX = centerX + Math.cos(rads * rot) * (radius + heightsArr[bufferLength - i]);
                    const negendY = centerY + Math.sin(rads * rot) * (radius + heightsArr[bufferLength - i]);
                    if (i <= bufferLength / 2) {
                        if (i == 0) {
                            ctx.beginPath()
                            ctx.moveTo(endX, endY)
                        }
                        ctx.lineTo(endX, endY)
                        if (i == bufferLength / 2) {
                            ctx.moveTo(endX, endY)
                        }
                    } else {
                        ctx.lineTo(negendX, negendY)
                        if (i == bufferLength - 1) {
                            rot = Math.ceil(changeRange(0, bufferLength, bufferLength, 0, -bufferLength / 4))
                            const negendX = centerX + Math.cos(rads * rot) * (radius + heightsArr[0]);
                            const negendY = centerY + Math.sin(rads * rot) * (radius + heightsArr[0]);
                            ctx.lineTo(negendX, negendY)
                            ctx.fill()
                        }
                    }
                    break; default:
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
            }

        };


        function getMedia() {
            return new Promise((resolve, reject) => {
                console.log('test 111');
                if (navigator.getUserMedia) {
                    // local_stream.getAudioTracks()[0].enabled = true;
                    console.log('test 222');
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
                    console.log('test 333');
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

        function animate() {
            console.log('test 444')
            analyser.getByteFrequencyData(dataArray);
            const setBounce = () => {
                let max = Math.max(...dataArray.slice(0, config.bufferLength / 2))
                let bounce = normalize1(max, 255, 0);
                let bounced = defaultState.radius + Math.floor(bounce * defaultState.bounceMultiplier)
                let height = bounced * 2 > window.innerHeight ? window.innerHeight / 2 : bounced
                let width = bounced * 2 > window.innerWidth ? window.innerWidth / 2 : bounced
                config.radius = Math.min(height, width)
                config.bounce = bounce
            }
            setBounce()
            drawVisualizer({ bufferLength, dataArray, config });
            requestAnimationFrame(animate); // calls the animate function again. This method is built in
        }

        async function listen_audio() {
            try {
                const stream = await getMedia();
                console.log('test 555', stream);
                
                local_stream = stream
                // local_stream.getAudioTracks()[0].enabled = true;
                let url = stream

                const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // for safari browser // I need to explain the browser restrictions & CORS issues here

                console.log('test 666');
                let source = audioCtx.createMediaStreamSource(url)

                analyser = audioCtx.createAnalyser();
                source.connect(analyser)

                analyser.fftSize = defaultState.fftSize // controls the size of the FFT. The FFT is a fast fourier transform. Basically the number of sound samples. Will be used to draw bars in the canvas

                console.log('test 777');
                bufferLength = defaultState.bufferLength;
                dataArray = new Uint8Array(bufferLength); // coverting to unsigned 8-bit integer array format because that's the format we need

                animate();
                return true;
            } catch (e) {
                console.log('Error I am in listen_audio');
                console.log(e)
                local_stream = null;
                return false;
            }
        }

        window.addEventListener('resize', () => {
            let height = defaultState.radius * 2 > window.innerHeight ? window.innerHeight / 2 : defaultState.radius
            let width = defaultState.radius * 2 > window.innerWidth ? window.innerWidth / 2 : defaultState.radius
            config.radius = Math.min(height, width)
            let resize_canvas = [window.innerWidth, window.innerHeight]
            maxDistributionX = window.innerWidth / 8;
            maxDistributionY = window.innerHeight / 4;
            [canvas.width, canvas.height] = resize_canvas;
        })
        // voice speech animation end


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
        document.querySelector("#circleinMic").onclick = async () => {
            document.getElementById('textResultUjjal').value = "";
            final_transcript = "";
            document.getElementById('toptooltip').style.display = "none";
            document.getElementById('bottomtooltip').style.display = "none";
            // speechRecognition.start();
            if (!isListening) {
                isListening = true;
                const is_avail = await listen_audio();
                console.log('listen_audio is_avail', is_avail);
                speechRecognition.start();
                if (is_avail) {
                    document.getElementById("canvas").style.display = "inline";
                //   speechRecognition.start();
                } else {
                  isListening = false;
                }
    
            } else {
                isListening = false;
                speechRecognition.stop();
            }
        };
    } else {
        console.log("Speech Recognition Not Available")
    }
}