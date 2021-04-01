(function () {
  const fireColorPalette = [
    { r: 7, g: 7, b: 7 },
    { r: 31, g: 7, b: 7 },
    { r: 47, g: 15, b: 7 },
    { r: 71, g: 15, b: 7 },
    { r: 87, g: 23, b: 7 },
    { r: 103, g: 31, b: 7 },
    { r: 119, g: 31, b: 7 },
    { r: 143, g: 39, b: 7 },
    { r: 159, g: 47, b: 7 },
    { r: 175, g: 63, b: 7 },
    { r: 191, g: 71, b: 7 },
    { r: 199, g: 71, b: 7 },
    { r: 223, g: 79, b: 7 },
    { r: 223, g: 87, b: 7 },
    { r: 223, g: 87, b: 7 },
    { r: 215, g: 95, b: 7 },
    { r: 215, g: 95, b: 7 },
    { r: 215, g: 103, b: 15 },
    { r: 207, g: 111, b: 15 },
    { r: 207, g: 119, b: 15 },
    { r: 207, g: 127, b: 15 },
    { r: 207, g: 135, b: 23 },
    { r: 199, g: 135, b: 23 },
    { r: 199, g: 143, b: 23 },
    { r: 199, g: 151, b: 31 },
    { r: 191, g: 159, b: 31 },
    { r: 191, g: 159, b: 31 },
    { r: 191, g: 167, b: 39 },
    { r: 191, g: 167, b: 39 },
    { r: 191, g: 175, b: 47 },
    { r: 183, g: 175, b: 47 },
    { r: 183, g: 183, b: 47 },
    { r: 183, g: 183, b: 55 },
    { r: 207, g: 207, b: 111 },
    { r: 223, g: 223, b: 159 },
    { r: 239, g: 239, b: 199 },
    { r: 255, g: 255, b: 255 },
  ];

  function configureFire(firePixels, fireWidth, fireHeigth) {
    const fireTotalPixels = fireWidth * fireHeigth;
    for (let i = 0; i < fireTotalPixels; i++) firePixels.push(0);
  }

  function generateFire(element, firePixels, fireWidth, fireHeigth) {
    const fireIntensity = parseInt($(element).attr('doom-fire'));
    const windValue = $(element).attr('wind');

    const fireLength = fireWidth * fireHeigth - 1;
    const maxPixelIndex = fireLength - fireWidth;

    for (const index in firePixels) {
      if (index <= maxPixelIndex) {
        const wind = Math.round(Math.random() * windValue);
        const fireDecay = Math.round(Math.random() * 2);
        const fireBellowPixelIndex = parseInt(index) + fireWidth;
        const newValue = firePixels[fireBellowPixelIndex] - fireDecay;
        firePixels[index - wind] = newValue >= 0 ? newValue : 0;
      } else {
        const finalFireIntensity =
          Math.ceil(Math.random() * 2) + (fireIntensity - 2);

        firePixels[index] = finalFireIntensity;
      }
    }

    renderFire(element, firePixels, fireWidth);
  }

  function renderFire(element, firePixels, fireWidth) {
    const debugging = $(element).attr('debugging') === 'true';
    const fireTable = $('<table>');
    const fireRows = [];

    firePixels.forEach((value, index) => {
      const lineBreak = index % fireWidth;
      const fireRowIndex = Math.floor(index / fireWidth);
      const fireData = $('<td>').addClass('fire-pixel');
      const colorObj = fireColorPalette[value];
      const color = `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`;

      if (!lineBreak) fireRows.push($('<tr>'));

      if (debugging) {
        const fireIndex = $('<div>').addClass('fire-index').html(index);
        const fireContent = $('<div>')
          .addClass('fire-content')
          .css('color', color)
          .html(value);
        fireData
          .append(fireIndex, fireContent)
          .addClass('pixel-debug')
          .css('background-color', '#5f5f5f');
      } else {
        fireData.css('background-color', color);
      }

      fireRows[fireRowIndex].append(fireData);
    });

    fireTable.append(fireRows);
    element.html(fireTable);
  }

  $.fn.doomFireStart = function (
    fireWidth,
    fireHeigth,
    fireIntensity = 36,
    wind = 0,
    debugging = false
  ) {
    const originalFireWidth = fireWidth;
    const originalFireHeight = fireHeigth;

    $(this).attr({ 'doom-fire': fireIntensity, wind });
    if (debugging) $(this).attr({ debugging });

    let firePixels = [];
    configureFire(firePixels, fireWidth, fireHeigth);
    renderFire(this, firePixels, fireWidth);

    const handleMutation = attr => {
      attr.forEach(e => {
        const attrName = e.attributeName;
        if (attrName === 'debugging') {
          const newValue = $(this).attr(attrName);
          firePixels = [];
          if (newValue) {
            fireWidth = 25;
            fireHeigth = 14;
          } else {
            fireWidth = originalFireWidth;
            fireHeigth = originalFireHeight;
          }
          configureFire(firePixels, fireWidth, fireHeigth);
        }
      });
    };
    const observer = new MutationObserver(handleMutation);
    observer.observe(document.querySelector('[doom-fire]'), {
      attributes: true,
    });

    setInterval(() => {
      generateFire(this, firePixels, fireWidth, fireHeigth);
    }, 70);

    return this;
  };
})();

$('[doom-fire]').doomFireStart(60, 40, 34, 2);
$('#toggle-debug').click(function () {
  const focusElement = $('[doom-fire]');
  if (!focusElement.attr('debugging')) {
    focusElement.attr('debugging', true).addClass('debug-mode');
    $(this).html('Normal Mode');
  } else {
    focusElement.removeAttr('debugging').removeClass('debug-mode');
    $(this).html('Debug Mode');
  }
});
