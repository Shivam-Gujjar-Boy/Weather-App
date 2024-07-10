// let newPara = document.createElement("p");
// document.body.appendChild(newPara);

// let input = document.querySelector("[data-inputText]");
// let butt = document.querySelector("#butt");

// butt.addEventListener("click", () => {
//   if (input.value != "") {
//     newPara.textContent = input.value + " " + typeof input.value;
//   }
// });

// let data;
// let data2;

// async function showWeather() {
//   try {
//     let cityID = 1697734;

//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?i=${cityID}&appid=8c496a0e8dfdaf5c8d5f75fe1bece35c`
//     );

//     const response2 = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?id=1275339&appid=8c496a0e8dfdaf5c8d5f75fe1bece35c`
//     );

//     data = await response.json();
//     data2 = response2.json();
//     console.log(data);
//     console.log(data2);

//     newPara.textContent = data.main.temp.toFixed(2) - 273 + "Degree Celcius";
//   } catch (error) {
//     console.log("NIGGA ERROR FOUND", error);
//   }
// }

// showWeather();
