function show(content) {
  console.log("show");
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  var notification = window.webkitNotifications.createNotification(
    '48.png',                      // The image.
    hour + time[2] + ' ' + period, // The title.
    content // The body.
  ).show();
}

function fetchCCTrayFeed(callback) {
  console.log("fetch");

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      // if (xhr.status == 200) {
        var xml = xhr.responseXML
        var projects = xml.getElementsByTagName('Project');
        callback(projects);
        // }
      // else {
        // callback(null);
      // }
    }
  }
  xhr.open('GET', localStorage.gourl, true);
  xhr.send();
};

function displayText(data) {
  console.log("displayText");
  if (data) {
    var content = "";
    for (var i=0, trend; trend = data[i]; i++) {
        var name = trend.getAttribute('name');
        var status = trend.getAttribute('lastBuildStatus');
        content+= " " + name + " " + status;
    }
    show(content);
  }
};

function load(){
// Conditionally initialize the options.
  console.log("load");

if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
  localStorage.gourl = "bla";
}

// Test for notification support.
if (window.webkitNotifications) {
  // While activated, show notifications at the display frequency.
  if (JSON.parse(localStorage.isActivated)) { fetchCCTrayFeed(displayText); }

  var interval = 0; // The display interval, in minutes.

  setInterval(function() {
    interval++;
    if (
      JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
    ) {
      fetchCCTrayFeed(displayText);
      interval = 0;
    }
  }, 60000);
}

}
load()