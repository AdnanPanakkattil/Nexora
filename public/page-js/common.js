$(document).ready(function() {
    // Handle main menu item clicks
    // Set up CSRF token for every AJAX request



    $('.main-menu').click(function() {
        var itemId = $(this).attr('id');
        alert(itemId);
        if (itemId === 'medical-records-main') {
            $('#medical-records-main').addClass('active open');
        } else {
            
        }
      $('.menu-item').removeClass('active');
      $(this).addClass('active');
      $(this).toggleClass('open');
    });

   
    
  });