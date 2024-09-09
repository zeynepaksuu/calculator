const canvas = document.getElementById('graphCanvas');
const context = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
let lineWidth = 2;
let xMin = -10, xMax = 10, yMin = -10, yMax = 10;
let functions = []; // Girilen fonksiyonları saklayan dizi
let functionId = 0; // Her fonksiyona bir id vermek için

const mathFunctions = ["sin", "cos", "tan", "log", "sqrt", "pow", "exp", "abs"]; // Desteklenen Math fonksiyonları

let isDragging = false;
let lastX, lastY;

// **Başlangıçta eksen etiketleme aralıklarını belirliyoruz**
let labelSpacingX = 1; // X ekseni için başlangıç etiketi aralığı
let labelSpacingY = 1; // Y ekseni için başlangıç etiketi aralığı

// Mouse ile sürükleyerek tuvali hareket ettirme
canvas.addEventListener('mousedown', function (e)
{
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

function addFunction()
{
    let funcInput = document.getElementById('functionInput').value;
    if (!funcInput) return; // Fonksiyon boşsa ekleme

    // Fonksiyon ön işlemler (3x -> 3*x, ^ -> **)
    funcInput = preprocessFunction(funcInput);

    // Fonksiyonu listede göster
    const functionList = document.getElementById('functionList');
    const funcItem = document.createElement('div');
    funcItem.className = `function-item`;
    funcItem.id = `function-item-${functionId}`;  // Benzersiz bir id ekliyoruz
    funcItem.innerHTML = `
        <span>f(x) = ${funcInput}</span>
        <button onclick="removeFunction(${functionId})">Kaldır</button>
    `;
    functionList.appendChild(funcItem);

    // Fonksiyonu diziye ekle
    functions.push({ id: functionId, expression: funcInput });
    functionId++;

    // Grafiği güncelle
    drawFunctions();
    updateLabels();
}


function updateGraph()
{
    xMin = parseFloat(document.getElementById('xMin').value);
    xMax = parseFloat(document.getElementById('xMax').value);
    yMin = parseFloat(document.getElementById('yMin').value);
    yMax = parseFloat(document.getElementById('yMax').value);
    lineWidth = parseFloat(document.getElementById('lineWidth').value);

    drawFunctions();
    updateLabels();
}


// Fonksiyonları ön işleme: sin -> Math.sin, 3x -> 3*x, ^ -> **
function preprocessFunction(funcInput)
{
    // Çarpma işlemi ve üslü işlemleri düzelt
    funcInput = funcInput.replace(/([0-9])x/g, '$1*x').replace(/\^/g, '**');

    // Desteklenen fonksiyonları Math ile birleştir
    const mathFunctions = ["sin", "cos", "tan", "log", "sqrt", "pow", "exp", "abs"];
    mathFunctions.forEach(fn =>
    {
        const regex = new RegExp(`\\b${fn}\\b`, 'g');
        funcInput = funcInput.replace(regex, `Math.${fn}`);
    });

    return funcInput.replace(/f\(x\)\s*=\s*/, '');
}

// Fonksiyonu kaldırma fonksiyonu
function removeFunction(id)
{
    // Diziden fonksiyonu kaldır
    functions = functions.filter(f => f.id !== id);

    // HTML'deki fonksiyon öğesini kaldır
    const funcItem = document.getElementById(`function-item-${id}`);
    if (funcItem)
    {
        funcItem.remove();  // HTML'den öğeyi kaldırıyoruz
    }

    // Grafiği güncelle
    drawFunctions();
    updateLabels();
}


// Tüm fonksiyonları çizme
function drawFunctions()
{
    drawGrid(); // Öncelikle grid'i çiz

    functions.forEach(f =>
    {
        drawFunction(f.expression); // Her bir fonksiyonu çiz
    });
}

// Tek bir fonksiyonu çizme
function drawFunction(funcInput)
{
    context.strokeStyle = "red";
    context.lineWidth = lineWidth;

    let func;
    try
    {
        func = new Function('x', `return ${applyUnits(funcInput)}`);
    } catch (e)
    {
        alert('Geçersiz fonksiyon! Lütfen doğru bir fonksiyon girin.');
        return;
    }

    context.beginPath();

    for (let i = xMin; i <= xMax; i += 0.01)
    {
        let y;
        try
        {
            y = func(i);
        } catch (e)
        {
            y = NaN; // Eğer fonksiyon hata verirse
        }

        if (y >= yMin && y <= yMax)
        {
            const screenX = ((i - xMin) / (xMax - xMin)) * width;
            const screenY = ((yMax - y) / (yMax - yMin)) * height;

            if (i === xMin)
            {
                context.moveTo(screenX, screenY);
            } else
            {
                context.lineTo(screenX, screenY);
            }
        }
    }

    context.stroke();
}

function applyUnits(funcInput)
{
    const unit = document.getElementById('units').value;
    if (unit === 'degree')
    {
        // Derece modunda trigonometri fonksiyonları radyan yerine derece alacak
        return funcInput.replace(/Math\.sin\(/g, 'Math.sin((Math.PI/180)*')
            .replace(/Math\.cos\(/g, 'Math.cos((Math.PI/180)*')
            .replace(/Math\.tan\(/g, 'Math.tan((Math.PI/180)*');
    }
    return funcInput; // Radyan modunda hiçbir değişiklik yapmadan döndür
}



function zoom(scaleFactor)
{
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    const xMid = (xMin + xMax) / 2;
    const yMid = (yMin + yMax) / 2;

    // Zoom yapmak için x ve y eksenlerini küçültüyoruz veya genişletiyoruz
    const newXRange = xRange * scaleFactor;
    const newYRange = yRange * scaleFactor;

    xMin = xMid - newXRange / 2;
    xMax = xMid + newXRange / 2;
    yMin = yMid - newYRange / 2;
    yMax = yMid + newYRange / 2;

    // X ve Y ekseni etiket aralığını zoom ile ayarlıyoruz
    labelSpacingX = Math.pow(10, Math.floor(Math.log10((xMax - xMin) / 10)));
    labelSpacingY = Math.pow(10, Math.floor(Math.log10((yMax - yMin) / 10)));

    // Yeniden çizim
    drawFunctions();
    updateLabels();
}

canvas.addEventListener('wheel', function (e)
{
    e.preventDefault(); // Sayfanın kaymasını engellemek için

    if (e.deltaY < 0)
    {
        // Zoom in
        zoom(0.9); // Ölçeği küçült
    } else
    {
        // Zoom out
        zoom(1.1); // Ölçeği büyüt
    }
});

canvas.addEventListener('mousemove', function (e)
{
    if (isDragging)
    {
        const deltaX = (e.clientX - lastX) * (xMax - xMin) / width;
        const deltaY = (lastY - e.clientY) * (yMax - yMin) / height;

        xMin -= deltaX;
        xMax -= deltaX;
        yMin -= deltaY;
        yMax -= deltaY;

        lastX = e.clientX;
        lastY = e.clientY;

        drawGrid();
        drawFunctions();
        updateLabels();
    }
});

canvas.addEventListener('mouseup', function ()
{
    isDragging = false;
});

// Izgara ve eksen çizimi
function drawGrid()
{
    context.clearRect(0, 0, width, height);  // Temizle
    context.lineWidth = lineWidth;
    context.strokeStyle = "#ccc";
    context.font = "10px Arial";  // Koordinat etiketleri için yazı tipi

    // Izgara çizgileri ve koordinat etiketleri
    for (let x = Math.ceil(xMin / labelSpacingX) * labelSpacingX; x <= xMax; x += labelSpacingX)
    {
        const screenX = ((x - xMin) / (xMax - xMin)) * width;
        context.beginPath();
        context.moveTo(screenX, 0);
        context.lineTo(screenX, height);
        context.stroke();

        // X ekseni üzerinde koordinat etiketleri
        const bodyClass = document.body.className;
        context.fillStyle = bodyClass === 'dark-theme' ? 'yellow' : 'black';
        context.fillText(x.toFixed(1), screenX - 10, ((yMax - 0) / (yMax - yMin)) * height + 15);
    }

    for (let y = Math.ceil(yMin / labelSpacingY) * labelSpacingY; y <= yMax; y += labelSpacingY)
    {
        const screenY = ((yMax - y) / (yMax - yMin)) * height;
        context.beginPath();
        context.moveTo(0, screenY);
        context.lineTo(width, screenY);
        context.stroke();

        // Y ekseni üzerinde koordinat etiketleri
        const bodyClass = document.body.className;
        context.fillStyle = bodyClass === 'dark-theme' ? 'yellow' : 'black';
        context.fillText(y.toFixed(1), ((0 - xMin) / (xMax - xMin)) * width - 30, screenY + 3);
    }

    // X ve Y eksenlerini çizme
    const bodyClass = document.body.className;
    context.strokeStyle = bodyClass === 'dark-theme' ? 'green' : 'red';
    context.lineWidth = 2;

    const xZero = ((0 - xMin) / (xMax - xMin)) * width;
    context.beginPath();
    context.moveTo(xZero, 0);
    context.lineTo(xZero, height);
    context.stroke();

    const yZero = ((yMax - 0) / (yMax - yMin)) * height;
    context.beginPath();
    context.moveTo(0, yZero);
    context.lineTo(width, yZero);
    context.stroke();
}

// X ve Y eksen etiketlerini sabit tutma
function updateLabels()
{
    const xLabels = document.getElementById('xLabels');
    const yLabels = document.getElementById('yLabels');

    // X ekseni etiketlerini sabit tut
    xLabels.innerHTML = `X: ${xMin.toFixed(1)} - ${xMax.toFixed(1)}`;

    // Y ekseni etiketlerini sabit tut
    yLabels.innerHTML = `Y: ${yMin.toFixed(1)} - ${yMax.toFixed(1)}`;
}
drawGrid();
updateLabels();
