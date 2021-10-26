Stripe.setPublishableKey('pk_test_51JkQKXSCxHLwPRj59yMPHkGPNvLwbEpqIXLbliwpMr9sHnhdF3pVlHb9myC1Bn0YfPumLOP9N6hPLShYWWZQFJii00PEbijefM')

var $form=$('#card-form')

$form.submit(function(event){
    $form.find('button').prop('disabled',true)
    Stripe.card.createToken({
        number:$('.cnumber').val(),
        cvv:$('.cvv').val(),
        expiry:$('.expdate').val(),
    },stripeResponseHandler)
    return false
})