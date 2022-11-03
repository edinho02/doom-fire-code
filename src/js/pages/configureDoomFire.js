(function () {
  const fireIntensityStep = 5;
  let fireIntensity = 34;

  $('[doom-fire]').doomFireStart(60, 40, fireIntensity, 2);

  $('#intensity-lower').click(function () {
    fireIntensity = fireIntensity - fireIntensityStep;

    if (fireIntensity <= 0) {
      fireIntensity = 0;
    }

    $('[doom-fire]').attr({ 'doom-fire': fireIntensity });
  });

  $('#intensity-add').click(function () {
    fireIntensity = fireIntensity + fireIntensityStep;

    if (fireIntensity >= 37) {
      fireIntensity = 37;
    }

    $('[doom-fire]').attr({ 'doom-fire': fireIntensity });
  });

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
})();
