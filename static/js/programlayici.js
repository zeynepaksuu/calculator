let currentValue = 0;
let currentMode = 'dec'; // Varsayılan mod: decimal
let inputMode = 'keypad'; // Varsayılan giriş modu
let bitCount = 16; // Varsayılan bit sayısı

// Giriş modunu ayarla (Keypad veya Bit Düzenleme)
function setInputMode()
{
    inputMode = document.getElementById('inputMode').value;

    if (inputMode === 'keypad')
    {
        document.getElementById('number-buttons').style.display = 'grid';
        document.getElementById('bit-display').style.display = 'none';
        updateDisplay(); // Keypad moduna geçerken ekranı güncelle
    } else if (inputMode === 'bit-edit')
    {
        document.getElementById('number-buttons').style.display = 'none';
        document.getElementById('bit-display').style.display = 'flex';
        updateBitDisplay(); // Bit moduna geçerken bitleri göster
    }
}

// Bit düzenleme ekranını güncelle
function updateBitDisplay()
{
    const bitDisplay = document.getElementById('bit-display');
    bitDisplay.innerHTML = ''; // Önce ekranı temizle

    let binaryString = currentValue.toString(2).padStart(bitCount, '0'); // Decimal değeri binary'ye çevir ve bitCount kadar sıfırla doldur
    for (let i = 0; i < binaryString.length; i++)
    {
        const bitSpan = document.createElement('span');
        bitSpan.innerText = binaryString[i];
        bitSpan.setAttribute('data-index', i);
        bitSpan.onclick = function ()
        {
            toggleBit(i);
        };
        bitDisplay.appendChild(bitSpan);
    }
}

// Tıklanan bitin değerini 0'dan 1'e veya 1'den 0'a çevir
function toggleBit(index)
{
    let bitArray = currentValue.toString(2).padStart(bitCount, '0').split('');
    bitArray[index] = bitArray[index] === '0' ? '1' : '0';
    currentValue = parseInt(bitArray.join(''), 2); // Binary'den decimal'e güncelle
    updateBitDisplay(); // Bit ekranını güncelle
    updateDisplay(); // Ekrandaki tüm tabanları güncelle
}

// Mod seçimi
function setMode()
{
    currentMode = document.getElementById('mode').value;
    updateHexButtons(); // HEX tuşlarını yönet
    updateNumberButtons(); // Sayı tuşlarını mod bazlı yönet
    updateDisplay();
}

// HEX modunda harfler parlak olacak, diğer modlarda soluk ve tıklanamaz olacak
function updateHexButtons()
{
    const hexButtons = document.querySelectorAll('.hex-btn');
    hexButtons.forEach(button =>
    {
        if (currentMode === 'hex')
        {
            button.classList.add('active');
            button.disabled = false;
        } else
        {
            button.classList.remove('active');
            button.disabled = true;
        }
    });
}

// Sayıları ekleme
// Sayıları ekleme
function appendNumber(num)
{
    // Eğer currentValue 0 ise direkt olarak num'u ekliyoruz
    if (currentValue === 0 || currentValue === "0")
    {
        currentValue = num.toString();
    } else
    {
        currentValue = currentValue.toString() + num.toString();
    }

    // Sadece display güncellemesi yapılacak. Değerleri HEX olarak tutuyoruz.
    updateDisplay();
}


// Ekranı güncelleme
function updateDisplay()
{
    // HEX moddayken değer string olarak gösterilecek
    document.getElementById('display').innerText = currentValue;

    // Taban dönüşümleri - Eğer currentValue hexadecimal değer içeriyorsa dönüştür
    const decimalValue = parseInt(currentValue, 16);

    document.getElementById('hexValue').innerText = decimalValue.toString(16).toUpperCase(); // HEX
    document.getElementById('decValue').innerText = decimalValue.toString(10); // DEC
    document.getElementById('octValue').innerText = decimalValue.toString(8); // OCT
    document.getElementById('binValue').innerText = decimalValue.toString(2).padStart(bitCount, '0'); // BIN
}


// İşlem yapma
function calculate()
{
    // Diğer işlemler buraya eklenebilir.
    updateDisplay();
    currentOperation = null;
    memoryValue = null;
}

// Bit kaydırma fonksiyonları
function shiftLeft()
{
    currentValue = parseInt(currentValue, 10) << 1;
    updateDisplay();
}

function shiftRight()
{
    currentValue = parseInt(currentValue, 10) >> 1;
    updateDisplay();
}

// Ekranı temizleme
function clearEntry()
{
    currentValue = 0;
    updateDisplay();
}

function clearAll()
{
    currentValue = 0;
    memoryValue = null;
    currentOperation = null;
    updateDisplay();
}

function setMode()
{
    currentMode = document.getElementById('mode').value;
    updateHexButtons(); // HEX tuşlarını yönet
    updateNumberButtons(); // Sayı tuşlarını mod bazlı yönet
    updateDisplay();
}

// HEX butonlarını yönet (A-F harfleri)
function updateHexButtons()
{
    const hexButtons = document.querySelectorAll('.hex-btn');
    hexButtons.forEach(button =>
    {
        if (currentMode === 'hex')
        {
            button.classList.add('active');
            button.disabled = false;
        } else
        {
            button.classList.remove('active');
            button.disabled = true;
        }
    });
}

// Sayı butonlarını mod bazlı yönet
function updateNumberButtons()
{
    const buttons = document.querySelectorAll('#number-buttons button');
    buttons.forEach(button =>
    {
        const value = button.innerText;
        if (currentMode === 'bin')
        {
            // Binary modda sadece 0 ve 1 kullanılabilir
            if (value === '0' || value === '1')
            {
                button.disabled = false;
            } else
            {
                button.disabled = true;
            }
        } else if (currentMode === 'oct')
        {
            // Octal modda 0-7 arası kullanılabilir
            if (value >= '0' && value <= '7')
            {
                button.disabled = false;
            } else
            {
                button.disabled = true;
            }
        } else if (currentMode === 'dec')
        {
            // Decimal modda 0-9 kullanılabilir
            if (value >= '0' && value <= '9')
            {
                button.disabled = false;
            } else
            {
                button.disabled = true;
            }
        } else if (currentMode === 'hex')
        {
            // HEX modda A-F ve 0-9 kullanılabilir (HEX butonları zaten ayrı yönetiliyor)
            button.disabled = false;
        }
    });
}


// İlk başta mod ve tuşlar ayarları yapalım
setMode();
