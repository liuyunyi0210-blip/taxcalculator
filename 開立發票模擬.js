function setCompanyInfoText(event){
	const { id } = event.target;
	const { value } = event.target;
	const $companyInfo = document.querySelector(`#${creatingInvoiceType}-section-invoice .${id}`);
	if (id === 'company-business-id' && value.length > 8) {
		$companyInfo.textContent = value.substr(0, 8);
	} else{
		$companyInfo.textContent = value;
	}
}

function changeTaxRate(elem){
	const taxCheck = document.querySelector(`#${creatingInvoiceType}-section-invoice .tax-apply-check`)
	taxRate = elem.target.value;
	if (taxRate === "" || parseInt(taxRate) === 5) {
		taxCheck.classList = "invoice-text tax-apply-check";
	} else if (parseInt(taxRate) === -1) {
		taxCheck.classList = "invoice-text tax-apply-check free-rate";
	}  else if (parseInt(taxRate) === 0) {
		taxCheck.classList = "invoice-text tax-apply-check zero-rate";
	}
	calculatePrice();
}

function checkPriceDigit(){
	const curVal = $receivePrice.value;
	if (curVal > 999999999) {
		$receivePrice.value = 999999999;
		return;
	}

	if (curVal % 1 !== 0) {
		$receivePrice.value = parseInt(curVal);
	}
}

function calculatePrice(){
	const priceIncludingTax = parseInt($receivePrice.value);
	const $taxRate = document.getElementById('tax-rate');
	let selectedTaxRate = $taxRate.value.trim();
	if (selectedTaxRate === "") {
		selectedTaxRate = 5;
	} else {
		selectedTaxRate = parseInt(selectedTaxRate);
	}

	if (isNaN(priceIncludingTax) || priceIncludingTax <= 0) {
		return;
	}

	const purePrice = Math.round(priceIncludingTax / (1 + selectedTaxRate / 100));
	const taxFee = Math.round(purePrice * (selectedTaxRate / 100));
	$taxFee.value = selectedTaxRate === -1 ? 0 : taxFee;
	$salePrice.value = selectedTaxRate === -1 ? priceIncludingTax : purePrice;

	const $singleItemprice = document.querySelector(`#${creatingInvoiceType}-section-invoice .invoice-single-item-price`);
	const $singleItempriceBottom = document.querySelector(`#${creatingInvoiceType}-section-invoice .invoice-single-item-price-bottom`);
	const formattedPrice = priceIncludingTax.toLocaleString();
	if (creatingInvoiceType === 'three') {
		const $saleSubtotalText = document.querySelector(`#${creatingInvoiceType}-section-invoice .sale-price-subtotal`);
		const $taxText = document.querySelector(`#${creatingInvoiceType}-section-invoice .inovice-tax-total`);
		$singleItemprice.textContent = (selectedTaxRate === -1 ? priceIncludingTax : purePrice).toLocaleString();
		$saleSubtotalText.textContent = (selectedTaxRate === -1 ? priceIncludingTax : purePrice).toLocaleString();
		$taxText.textContent = (selectedTaxRate === -1 ? 0 : taxFee).toLocaleString();
	} else {
		$singleItemprice.textContent = formattedPrice;
	}

	$singleItempriceBottom.textContent = formattedPrice;

	const chinesePrice = convertToChinese(priceIncludingTax);
	setChinesePriceText(chinesePrice);
}

function convertToChinese(num) {
    const numbers = ["零", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
    let numStr = num.toString();
    let result = "";
    const length = 9;
    numStr = numStr.split('').reverse().join('');

    // Ensure that we cover all positions
    numStr = numStr.padEnd(length, '0');
    for (let i = 0; i < numStr.length; i++) {
        const digit = parseInt(numStr[i]);
        result = numbers[digit] + result;
    }
    return result;
}

function setChinesePriceText(chinesePriceText){
	const cutUnit = chinesePriceText.split("");
	const priceUnitText = document.querySelectorAll(`#${creatingInvoiceType}-section-invoice .invoice-single-item-price-upper .price`);
	if (priceUnitText.length < cutUnit.length) {
        return;
    }

	cutUnit.forEach((unit, idx) => {
		if (priceUnitText[idx]) { 
			priceUnitText[idx].textContent = unit;
		}
	})
}

function getInvoiceDateInfo() {
    const taiwanTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" });
    const date = new Date(taiwanTime);
    const month = date.getMonth() + 1;
    const chineseMonths = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
    let invoiceMonthText = chineseMonths[month - 1];
    if (month %2 === 0) {
    	invoiceMonthText = chineseMonths[month - 2] + " 、 " + invoiceMonthText
    } else {
    	invoiceMonthText = invoiceMonthText + " 、 " + chineseMonths[month]
    }
    return [invoiceMonthText, month, date.getDate()];
}

function setInvoiceDate(texts){
	const monthly = texts[0];
	const month = texts[1];
	const date = texts[2];

	['two', 'three'].forEach(sectionNum => {
		const $monthlyText = document.querySelector(`#${sectionNum}-section-invoice .invoice-month`);
		const $monthText = document.querySelector(`#${sectionNum}-section-invoice .invoice-month-numeric`);
		const $dateText = document.querySelector(`#${sectionNum}-section-invoice .invoice-date-numeric`);
		$monthlyText.textContent = monthly;
		$monthText.textContent = month;
		$dateText.textContent = date;
	})
}

function resetCustomerValues(){
	$receivePrice.value = "";
	const $taxRate = document.getElementById('tax-rate');
	$taxRate.value = "5";
	$taxFee.value = "";
    $salePrice.value = "";

    const $saleSubtotalText = document.querySelector(`#${creatingInvoiceType}-section-invoice .sale-price-subtotal`);
	const $taxText = document.querySelector(`#${creatingInvoiceType}-section-invoice .inovice-tax-total`);
	$saleSubtotalText.textContent = "";
	$taxText.textContent = "";

    const $singleItemprice = document.querySelector(`#${creatingInvoiceType}-section-invoice .invoice-single-item-price`);
	const $singleItempriceBottom = document.querySelector(`#${creatingInvoiceType}-section-invoice .invoice-single-item-price-bottom`);
	$singleItemprice.textContent = "";
	$singleItempriceBottom.textContent = "";
	setChinesePriceText("零零零零零零零零零");
}

// create invoice date text
const invoiceDateInfo = getInvoiceDateInfo();
let creatingInvoiceType = "two";
let taxRate = "";
let $companyName, $companyBusinessId, $receivePrice, $taxFee, $salePrice = null;
(function(){
	const viewStepContainer = (type) => {
		const step2Title = document.querySelector("#step-2 h2");
		const step3Title = document.querySelector("#step-3 h2");

		if (type === 'two') {
			step2Container.classList.remove('d-block');
			step2Container.classList.add('d-none');
			step3Title.textContent =  "STEP2發票開立資訊";
		} else {
			step2Container.classList.add('d-block');
			step2Container.classList.remove('d-none');
			step3Title.textContent =  "STEP3發票開立資訊";
		}
	}

	const switchInvoiceBG = (type) => {
		creatingInvoiceType = type;
		if (type === 'two') {
			twoSectionImage.classList.add('d-block');
			twoSectionImage.classList.remove('d-none');
			threeSectionImage.classList.add('d-none');
			threeSectionImage.classList.remove('d-block');
		} else {
			twoSectionImage.classList.add('d-none');
			twoSectionImage.classList.remove('d-block');
			threeSectionImage.classList.add('d-block');
			threeSectionImage.classList.remove('d-none');
		}
		viewStepContainer(type);
		resetCustomerValues();
	}

	const step2Container = document.getElementById('step-2');
	const step3Container = document.getElementById('step-3');
	const twoSectionInvoiceType = document.getElementById('two-section');
	const twoSectionImage = document.getElementById('two-section-invoice');
	const threeSectionInvoiceType = document.getElementById('three-section');
	const threeSectionImage = document.getElementById('three-section-invoice');

	twoSectionInvoiceType.addEventListener("change", function() {
		switchInvoiceBG('two');
    });

    threeSectionInvoiceType.addEventListener("change", function() {
    	switchInvoiceBG('three');
    });

    setInvoiceDate(invoiceDateInfo);

    $receivePrice = document.getElementById('receive-from-customer');
    $receivePrice.addEventListener('input', function(){
    	checkPriceDigit();
    	calculatePrice();
    })

    $taxFee = document.getElementById('tax-money');
    $salePrice = document.getElementById('sale-price');


    $companyName = document.getElementById('company-name');
    $companyBusinessId = document.getElementById('company-business-id');
    [$companyName, $companyBusinessId].forEach( dom => {
    	dom.addEventListener('blur', function(e){
    		setCompanyInfoText(e);
    	})
    });
})()