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
            console.log("asdfasdfsdf")
            // setTimeout(() => {
            //     speechRecognition.stop();
            // }, 10000)

        };
        speechRecognition.onend = () => {
            document.getElementById('outlineMic').style.animation = ""
            document.getElementById('outlineMic').style.animation = ""
            // document.getElementById('pidsWrapper').style.display = "none";
            // setTimeout(async () => {
            //     if (final_transcript.length === 0) {
            //         final_transcript = "apartment"
            //     }
            //     const response = await fetch('https://kz5l9o5qci.execute-api.us-east-1.amazonaws.com/' + encodeURI(final_transcript) + '/' + encodeURI(locationValue));
            //     const responseJson = await response.json();
            //     if (responseJson.status) {
            //         window.open(responseJson.url, "_self");
            //         const matchedWords = responseJson.matching_word;
            //         let final_transcript_color = final_transcript
            //         matchedWords.map(el => {
            //             let key = Object.keys(el)[0]
            //             if (final_transcript.toLowerCase().includes(key)) {
            //                 let color = 'red';
            //                 if (el[key] === 'location') {
            //                     color = 'red'
            //                 } else if (el[key] === 'bathroom' || el[key] === 'bedroom' || el[key] === 'park') {
            //                     color = 'darkslateblue'
            //                 } else if (el[key] === 'amenities') {
            //                     color = 'blue'
            //                 } else if (el[key] === 'filters') {
            //                     color = 'violet'
            //                 } else if (el[key] === 'category') {
            //                     color = 'green'
            //                 } else if (el[key] === 'floor') {
            //                     color = 'skyblue'
            //                 } else if (el[key] === 'type') {
            //                     color = 'darkgreen'
            //                 } else if (el[key] === 'available') {
            //                     color = 'darkblue'
            //                 }
            //                 final_transcript_color = final_transcript_color.toLowerCase().replace(key, '<span style="color: ' + color + ';">' + key[0].toUpperCase() + key.slice(1) + '</span>')
            //             }
            //         });
            //         document.getElementById('textResultUjjal').innerHTML = final_transcript_color;
            //     }
            // }, 500)
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
        };
        // Set the onClick property of the start button
        document.querySelector("#circleinMic").onclick = () => {
            document.getElementById('textResultUjjal').value = "";
            final_transcript = "";
            document.getElementById('toptooltip').style.display="none";
            document.getElementById('bottomtooltip').style.display="none";
            speechRecognition.start();
        };
    } else {
        console.log("Speech Recognition Not Available")
    }
}