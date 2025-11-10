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
	
	// 檢查哪個欄位有值，優先從有值的欄位計算
	const salePrice = parseInt($salePrice.value);
	const receivePrice = parseInt($receivePrice.value);
	const taxAmount = parseInt($taxFee.value);
	
	if (!isNaN(salePrice) && salePrice > 0) {
		// 如果有銷售額輸入，從銷售額計算
		const event = { target: $salePrice };
		calculateFromSalePrice(event);
	} else if (!isNaN(receivePrice) && receivePrice > 0) {
		// 如果有收款額輸入，從收款額計算
		const event = { target: $receivePrice };
		calculateFromReceivePrice(event);
	} else if (!isNaN(taxAmount) && taxAmount > 0) {
		// 如果有稅額輸入，從稅額計算
		const event = { target: $taxFee };
		calculateFromTaxAmount(event);
	} else {
		// 都沒有值，使用原來的計算方式
		calculatePrice();
	}
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

function calculateFromSalePrice(event){
	const salePrice = parseInt(event.target.value);
	const $taxRate = document.getElementById('tax-rate');
	let selectedTaxRate = $taxRate.value.trim();
	if (selectedTaxRate === "") {
		selectedTaxRate = 5;
	} else {
		selectedTaxRate = parseInt(selectedTaxRate);
	}

	if (isNaN(salePrice) || salePrice <= 0) {
		$taxFee.value = "";
		$receivePrice.value = "";
		return;
	}

	const taxFee = Math.round(salePrice * (selectedTaxRate / 100));
	const priceIncludingTax = selectedTaxRate === -1 ? salePrice : salePrice + taxFee;
	
	$taxFee.value = selectedTaxRate === -1 ? 0 : taxFee;
	$receivePrice.value = priceIncludingTax;

	const $singleItemprice = document.querySelector(`#${creatingInvoiceType}-section-invoice .invoice-single-item-price`);
	const $singleItempriceBottom = document.querySelector(`#${creatingInvoiceType}-section-invoice .invoice-single-item-price-bottom`);
	const formattedPrice = priceIncludingTax.toLocaleString();
	if (creatingInvoiceType === 'three') {
		const $saleSubtotalText = document.querySelector(`#${creatingInvoiceType}-section-invoice .sale-price-subtotal`);
		const $taxText = document.querySelector(`#${creatingInvoiceType}-section-invoice .inovice-tax-total`);
		$singleItemprice.textContent = salePrice.toLocaleString();
		$saleSubtotalText.textContent = salePrice.toLocaleString();
		$taxText.textContent = (selectedTaxRate === -1 ? 0 : taxFee).toLocaleString();
	} else {
		$singleItemprice.textContent = priceIncludingTax.toLocaleString();
	}
	$singleItempriceBottom.textContent = formattedPrice;

	const chinesePrice = convertToChinese(priceIncludingTax);
	setChinesePriceText(chinesePrice);
}

function calculateFromReceivePrice(event){
	const priceIncludingTax = parseInt(event.target.value);
	const $taxRate = document.getElementById('tax-rate');
	let selectedTaxRate = $taxRate.value.trim();
	if (selectedTaxRate === "") {
		selectedTaxRate = 5;
	} else {
		selectedTaxRate = parseInt(selectedTaxRate);
	}

	if (isNaN(priceIncludingTax) || priceIncludingTax <= 0) {
		$taxFee.value = "";
		$salePrice.value = "";
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
		$singleItemprice.textContent = priceIncludingTax.toLocaleString();
	}
	$singleItempriceBottom.textContent = formattedPrice;

	const chinesePrice = convertToChinese(priceIncludingTax);
	setChinesePriceText(chinesePrice);
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
    const year = date.getFullYear() - 1911; // 轉換為民國年
    const chineseMonths = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
    const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    
    // 轉換年份為中文
    let chineseYear = "一";
	const tens = Math.floor((year % 100) / 10);
	const ones = year % 10;
	chineseYear += chineseNumbers[tens];
	chineseYear += chineseNumbers[ones];
    
    let invoiceMonthText = chineseMonths[month - 1];
    if (month %2 === 0) {
    	invoiceMonthText = chineseMonths[month - 2] + "　" + invoiceMonthText
    } else {
    	invoiceMonthText = invoiceMonthText + "　" + chineseMonths[month]
    }
    return [invoiceMonthText, chineseYear, year, month, date.getDate()];
}

function setInvoiceDate(texts){
	const monthly = texts[0];
	const chineseYear = texts[1];
	const numericYear = texts[2];
	const month = texts[3];
	const date = texts[4];

	['two', 'three'].forEach(sectionNum => {
		const $monthlyText = document.querySelector(`#${sectionNum}-section-invoice .invoice-month`);
		const $chineseYearText = document.querySelector(`#${sectionNum}-section-invoice .invoice-year-chinese`);
		const $numericYearText = document.querySelector(`#${sectionNum}-section-invoice .invoice-year-numeric`);
		const $monthText = document.querySelector(`#${sectionNum}-section-invoice .invoice-month-numeric`);
		const $dateText = document.querySelector(`#${sectionNum}-section-invoice .invoice-date-numeric`);
		$monthlyText.textContent = monthly;
		$chineseYearText.textContent = chineseYear;
		$numericYearText.textContent = numericYear;
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
})();

function calculateFromTaxAmount(event){
	const taxAmount = parseInt(event.target.value);
	const $taxRate = document.getElementById('tax-rate');
	let selectedTaxRate = $taxRate.value.trim();
	if (selectedTaxRate === "") {
		selectedTaxRate = 5;
	} else {
		selectedTaxRate = parseInt(selectedTaxRate);
	}

	if (isNaN(taxAmount) || taxAmount < 0) {
		$salePrice.value = "";
		$receivePrice.value = "";
		return;
	}

	if (selectedTaxRate === -1) {
		// 免稅情況
		$salePrice.value = "";
		$receivePrice.value = "";
		return;
	}

	if (selectedTaxRate === 0) {
		// 零稅率情況
		$salePrice.value = "";
		$receivePrice.value = "";
		return;
	}

	// 從稅額計算未稅金額
	const purePrice = Math.round(taxAmount / (selectedTaxRate / 100));
	const priceIncludingTax = purePrice + taxAmount;
	
	$salePrice.value = purePrice;
	$receivePrice.value = priceIncludingTax;

	const $singleItemprice = document.querySelector(`#${creatingInvoiceType}-section-invoice .invoice-single-item-price`);
	const $singleItempriceBottom = document.querySelector(`#${creatingInvoiceType}-section-invoice .invoice-single-item-price-bottom`);
	const formattedPrice = priceIncludingTax.toLocaleString();
	if (creatingInvoiceType === 'three') {
		const $saleSubtotalText = document.querySelector(`#${creatingInvoiceType}-section-invoice .sale-price-subtotal`);
		const $taxText = document.querySelector(`#${creatingInvoiceType}-section-invoice .inovice-tax-total`);
		$singleItemprice.textContent = purePrice.toLocaleString();
		$saleSubtotalText.textContent = purePrice.toLocaleString();
		$taxText.textContent = taxAmount.toLocaleString();
	} else {
		$singleItemprice.textContent = priceIncludingTax.toLocaleString();
	}
	$singleItempriceBottom.textContent = formattedPrice;

	const chinesePrice = convertToChinese(priceIncludingTax);
	setChinesePriceText(chinesePrice);
}