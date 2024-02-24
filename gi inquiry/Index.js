

var timeout = 600000;
// var timeoutTimer;

function returnLoginPage() {
  if (!sessionStorage.getItem("counselorId")) {
    window.location.href = "loginIn.html";
  }
}
returnLoginPage();

// to set timeout
function timer() {
  this.timeoutTimer = setTimeout(() => {
    sessionStorage.removeItem("counselorId");
    alert("Session Expired");
    returnLoginPage();
  }, timeout);
}

// to reset timeout
function resetTimer() {
  clearTimeout(this.timeoutTimer);
  timer();
}
resetTimer();

// timeout reset on key press and mouse move
window.addEventListener("keydown", (e) => {
  // console.log(e);
  if (e) resetTimer();
});
window.addEventListener("mousemove", () => {
  resetTimer();
});

// course fees drop down list 
function showDropDown() {
  document.querySelector(".course-drop-list").classList.toggle("course-drop-list-show")
}

// course fees class
class courseAndFees {
  constructor() {
    this.courseDetails = {}
    this.fees = {};
    this.feesTotal;
    this.courseId;
    this.pdfList = {}
    this.pdf;
    this.displayTotalFees;
  }

  handleChange(event) {
    //  console.log(event.target);
    // console.log(this.courseDetails);

    if (document.getElementById(event.target.id).checked == true) {

      this.fees[this.courseDetails[event.target.id].course_id] = this.courseDetails[event.target.id].fees;
      this.pdfList[this.courseDetails[event.target.id].course_id] = this.courseDetails[event.target.id].pdf;

    }
    else {
      delete this.fees[this.courseDetails[event.target.id].course_id]
      delete this.pdfList[this.courseDetails[event.target.id].course_id]
    }

    this.feesTotal = Object.values(this.fees)
    this.courseId = Object.keys(this.fees)
    this.pdf = Object.values(this.pdfList)

    // console.log(this.feesTotal);
    this.displayTotalFees = this.feesTotal.reduce((total, num) => {
      return total += num;
    }, 0)

    console.log(this.courseId);
    document.getElementById("show-fees").value = this.displayTotalFees;
    document.getElementById("select-course-heading").innerHTML = `${this.courseId.length} Courses Selected `;
  }

}
var courseAndFeesObj = new courseAndFees()


// Api services 

class apiServices {
  constructor() {
    this.url = 'http://192.168.29.183:8000'
  }

  getAllCoursesAndFeesEnquires() {
    fetch(`${this.url}/get_all_course_and_fees`, {
      headers: {
        'accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        var div = ``
        res.courses_and_fees.map((value) => {
          // console.log(value);
          div += `<div style='cursor:pointer;'><input type="checkbox" style='cursor:pointer;' onchange='courseAndFeesObj.handleChange(event)' id=${value.course_id}/> ${value.course_name} </div> `

          courseAndFeesObj.courseDetails[value.course_id] = value;

        })
        document.getElementById("course-drop-list").innerHTML = div
      })
  }

  getAllCoursesAndFeesBatch() {
    fetch(`${this.url}/get_all_course_and_fees`, {
      headers: {
        'accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        var opt = ``
        opt += `<option>Select Course</option>`
        res.courses_and_fees.map((value) => {
          // console.log(value);
          opt += `<option value=${value.course_id}>${value.course_name}</option>`

          // courseAndFeesObj.courseDetails[value.course_id] = value;

        })
        document.getElementById("batch-drop-down").innerHTML = opt
      })
  }

  addStudent() {
    fetch(`${this.url}/add_student`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': document.getElementById("full-name").value,
        'email': document.getElementById("email").value,
        'contact_1': document.getElementById("contact1").value,
        'contact_2': document.getElementById("contact1").value,
        'area': document.getElementById("area").value,
        'college_name': document.getElementById("clg-name").value,
        'mode': sessionStorage.getItem("modeOfEnquiry"),
        'date_of_join': document.getElementById("join-date").value,
        'reference': 'no',
        'counselor_id': sessionStorage.getItem("counselorId"),
        'course_ids': courseAndFeesObj.courseId,
        'fees_list': courseAndFeesObj.feesTotal,
        'pdf_list': courseAndFeesObj.pdf,
        'remark': "no"
      })
    })
      .then(res => res.json())
      .then(res => alert(res.detail.message))
      .catch(res => console.log(res.detail.message))
  }

  addBatch() {
    fetch(`${this.url}/add_batch`, {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
      body: new URLSearchParams({
        'counselor_id': sessionStorage.getItem("counselorId"),
        'daily_hours': document.getElementById("daily-hrs").value,
        'start_date': document.getElementById("start-date").value,
        'name': document.getElementById("batch-name").value,
        'time': document.getElementById("time").value,
        'weekly_days': document.getElementById("weekly-days").value,
        'trainer_name': document.getElementById("trainer").value,
        'expected_end_date': document.getElementById("end-date").value,
        'course_id': document.getElementById("batch-drop-down").value
      })
    })
      .then(res => res.json())
      .then(res => alert(res.detail.message))
  }

  addCourse() {
    fetch(`${this.url}/add_course`, {
      method: 'POST',
      headers: {
        'accept': 'application/json'
      },
      body: new URLSearchParams({
        'counselor_id': sessionStorage.getItem("counselorId"),
        'sample_project': document.getElementById("sample-project").value,
        'other_link': document.getElementById("other-link").value,
        'name': document.getElementById("course-name").value,
        'fees': document.getElementById("fees").value,
        'pdf': document.getElementById("pdf-link").value,
        'note': document.getElementById("note").value,
        'duration': document.getElementById("course-duration").value,
        'objective': document.getElementById("objective").value,
        'description': document.getElementById("desc").value,
        'prerequisites_sub': document.getElementById("sub").value
      })
    })
      .then(res => res.json())
      .then(res => alert(res.detail.message))
  }
}
var apiObj = new apiServices();
