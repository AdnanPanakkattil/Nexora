$(document).ready(function () {
    console.log('Script loaded');

    let datas2 = JSON.parse(localStorage.getItem('data'));
    console.log('Loaded data:', datas2);

    let totalNetCost = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let finalAmount = 0;

    if (datas2) {
        let serviceOrderList = datas2.serviceOrderList;

        if (Array.isArray(serviceOrderList) && serviceOrderList.length > 0) {
            serviceOrderList.forEach(function (serviceOrder, index) {
                // Check if selectedServicename is truthy, otherwise use manualServiceName
                let nameField = serviceOrder.selectedServicename ? serviceOrder.selectedServicename : serviceOrder.manualServiceName || 'N/A';
                let codeField = serviceOrder.selectedServicecode ? serviceOrder.selectedServicecode : serviceOrder.manualServiceCode || 'N/A';

                
               
                let qty = serviceOrder.qty || 'N/A';
                let netCost = parseFloat(serviceOrder.netCost) || 0; // Ensure netCost is a number
                let cost = serviceOrder.cost || 'N/A';
                let discountPercentage = serviceOrder.discountPercentage || 'N/A';
                let flatAmount = parseFloat(serviceOrder.flatAmount) || 0;
                let disAmount = parseFloat(serviceOrder.disAmount) || 0; 
                let manuelTaxPercentage = serviceOrder.manuelTaxPercentage || 'N/A';
                let manuelTaxCost = parseFloat(serviceOrder.manuelTaxCost) || 0; 
                let taxCost = parseFloat(serviceOrder.taxCost) || 0;

                totalNetCost += netCost; 
                totalDiscount += (flatAmount + disAmount);
                totalTax += (manuelTaxCost + taxCost) / 2;
                finalAmount = totalNetCost + totalDiscount + totalTax;

                let newRow = `
                    <tr>
                        <td>${nameField}</td> 
                        <td>${codeField}</td>
                        <td>${qty}</td>
                        <td>${netCost.toFixed(2)}</td> 
                        <td class="flat-header">${flatAmount}</td>
                        <td class="disc-percent-header">${discountPercentage}</td>
                        <td class="disc-amount-header">${disAmount}</td>
                        <td>${manuelTaxPercentage}</td>
                        <td>${manuelTaxCost}</td>
                        <td>${cost}</td>
                    </tr>
                `;
                $('#service_div').append(newRow);
            });

            $('.total-net-cost').text(`$${totalNetCost.toFixed(2)}`);
            $('.total-discount').text(`$${totalDiscount.toFixed(2)}`);
            $('.total-vat').text(`$${totalTax.toFixed(2)}`);
            $('.final-amount').text(`$${finalAmount.toFixed(2)}`);
        } else {
            console.log('No service orders found.');
        }

        var discountType = datas2.discount_type;
        if (datas2.financialCategory == 1) {
            $('.financial-category').text('Cash');
        } else if (datas2.financialCategory == 2) {
            $('.financial-category').text('Insurance');
        } else {
            $('.financial-category').text('Company');
        }

        $('.Branch').text(datas2.clinicName);
        $('.Patient').text(datas2.clientName || 'N/A');
        $('.Department').text(datas2.department || 'N/A');
        $('.Provider').text(datas2.provider || 'N/A');
        $('.discount_type').text(discountType || 'N/A');
        $('.Nationality').text(datas2.Nationality || 'N/A');
        $('.patientsName').text(datas2.patientsName || 'N/A');
        $('.patientNameArabic').text(datas2.patientNameArabic || 'N/A');
        $('.patientDOB').text(datas2.patientDOB || 'N/A');
        $('.patientMobile').text(datas2.patientMobile || 'N/A');

        $('.invoiceId').text(datas2.masterIdNumber || 'N/A');
        $('.Date1').text(datas2.billIssuedDate || 'N/A');

        if (discountType === 'flat') {
            $('.disc-percent-header').hide();
            $('.disc-amount-header').hide();
            $('.flat-header').show();
        } else if (discountType === 'percentage') {
            $('.flat-header').hide();
            $('.disc-percent-header').show();
            $('.disc-amount-header').show();
        } else {
            $('.flat-header').hide();
            $('.disc-percent-header').hide();
            $('.disc-amount-header').hide();
        }
    } else {
        console.log('No data found in localStorage.');
    }
});
