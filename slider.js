let sliderContainer = document.querySelector('.slider__container'),
    slider = document.createElement('div'),
    rangeBlock = document.createElement('div'),
    handler,
    icon = true,
    sliderInput = document.createElement('div'),
    startingValue = 0,
    endValue = 100,
    defaultValue = (endValue - startingValue) / 2, 
    currentValue = [],
    currentPosition = [],
    range = true,
    rangeStart = [1, 2], //порядковый номер бегунка с которого начинается диапазон
    rangeEnd = [3, 4], //порядковый номер бегунка на котором заканчивается диапазон
    handlersAmount = 5;
   
    slider.classList.add('slider__slider');
    sliderInput.classList.add('slider__input');
    sliderContainer.append(slider);
    sliderContainer.append(sliderInput);
    rangeBlock.classList.add('slider__range');
    slider.append(rangeBlock);


 
// Функция создания заданного кол-ва бегунков
function createHandlers(handlersAmount){
    for (let i = 1; i <= handlersAmount; i++){
        handler = document.createElement('div');
        handler.classList.add('slider__handler');
        slider.append(handler);
        if(icon){
            icon = document.createElement('div');
            icon.classList.add('slider__icon');
            handler.append(icon);
        };
    }
};
createHandlers(handlersAmount);

let sliderPosition = slider.getBoundingClientRect(); //получаем данные о слайдере
let handlers = slider.querySelectorAll('.slider__handler');
let icons = document.querySelectorAll('.slider__icon');
// console.log(handlers, icons);    
getCurrentValue(); //получаем значение первноначального положения бегунков

//функция  расчета текущего значения каждого из бегунков
function getCurrentValue(){
    for (let i = 0; i < handlers.length; i++){
        currentPosition[i] = handlers[i].getBoundingClientRect();
        let minPosition = -1,
            maxPosition = sliderPosition.width - 1 - currentPosition[i].width,
            rangePosition = maxPosition - minPosition,
            ratePosition = rangePosition / ((endValue) - (startingValue));
        if (currentPosition[i].x  == sliderPosition.x){currentValue[i] = startingValue;}
        else if(currentPosition[i].x == (sliderPosition.width - currentPosition[i].width)){currentValue[i] = endValue;}
        else {
            currentValue[i] = startingValue + (currentPosition[i].x - sliderPosition.x) / ratePosition;
        }
        if (icon) {
            icons[i].innerHTML = currentValue[i].toFixed(0);
        } 
    };
    
};

// Перемещение бегунка при перетаскивании мышью
function moveByMouse(){
    handlers.forEach(function(item){
        item.addEventListener('mousedown', function(event) {
            event.preventDefault(); // предотвратить запуск выделения 
            let currentPosition = item.getBoundingClientRect();
            let shiftX = event.clientX - currentPosition.x;
            item.classList.add('slider__handler_active');
            document.addEventListener('mousemove', onMouseMove);
            function onMouseMove(event) {
                let newLeft = event.clientX - shiftX - sliderPosition.x;
                if (newLeft < -1) {
                    newLeft = -1;
                }
                if (newLeft > sliderPosition.width - 1 - currentPosition.width) {
                    newLeft = sliderPosition.width - 1 - currentPosition.width;
                }
                item.style.left = newLeft + 'px';
                let itemCurrentValue = getCurrentValue(); 
                if (range){
                    getCurrentRange(rangeStart[0], rangeEnd[0]);
                    getCurrentRange(rangeStart[1], rangeEnd[1]);
                };

                console.log(currentValue);
                console.log(currentPosition);   
            }
            document.addEventListener('mouseup', onMouseUp);
            function onMouseUp() {
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('mousemove', onMouseMove);
                item.classList.remove('slider__handler_active');
            };
           
        });
        handler.ondragstart = function() {
            return false;
        };
        
    });
};
moveByMouse();

// Функция расчета диапазона между 2-мя заданными бегунками

function getCurrentRange(rangeStart, rangeEnd){
    let rangeStartValue = currentValue[rangeStart - 1],
        rangeEndValue = currentValue[rangeEnd - 1],
        rangeValue = Math.abs(rangeEndValue - rangeStartValue),
        rangeStartPosition = currentPosition[(rangeStart - 1)].x,
        rangeEndPosition = currentPosition[(rangeEnd - 1)].x, 
        rangeLength = Math.abs(rangeEndPosition - rangeStartPosition),
        rangeLeftShift;
    rangeBlock.style.width = rangeLength + 'px';
    if ((rangeEndPosition - rangeStartPosition) > 0){
        rangeBlock.style.left = (rangeStartPosition - sliderPosition.x) + 'px';
    } else{
        rangeBlock.style.left = (rangeEndPosition- sliderPosition.x) + 'px';
    }; 
    sliderInput.innerHTML = rangeValue.toFixed(0);
};


// перемещение бегунка при клике по слайдеру вне бегунка
// function moveOnClick(){ 
//     let currentPosition = handler.getBoundingClientRect();   
//     slider.addEventListener('click', function(event){
//         if(event.target !== handler){
//             let newLeft = event.clientX -  sliderPosition.x - 1;
//             if (newLeft < -1) {
//                 newLeft = -1;
//             }
//             if (newLeft > sliderPosition.width - 1 - currentPosition.width) {
//                 newLeft = sliderPosition.width - 1 - currentPosition.width;
//             }
//             handler.style.left = newLeft + 'px';
//             getCurrentValue(); 
//         }
//     });
// };

// moveOnClick();


// if (icon == false){
//     let inputText = itemCurrentValue.toFixed(0);
//     sliderInput.innerHTML = inputText;  
// }; 