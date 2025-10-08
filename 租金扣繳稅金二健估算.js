let $tenantActualPay = null, $landlordActualReceive = null, $withholdingTax = null, $healthInsuranceTax = null, $taxTotal = null, $withholdingCertificate = null;
let $personalOption = null;
let $companyOption = null;
let $personalTicket = null, $companyTicket = null;

let applyMoney = 0;
let includingTax = true;
const discountRate = 0.1;
const secondGenerationHealthyMoneyRate = 0.0211;

function resetWholeTickets(){
	['rent-sale', 'rent-tax', 'rent-total'].forEach( domId => {
		const $textItem = document.getElementById(`${domId}-price`);
		if ($textItem) {
			$textItem.textContent = "$0";
		}
	})

	if ($tenantActualPay) $tenantActualPay.textContent = "$0";
	if ($landlordActualReceive) $landlordActualReceive.textContent = "$0";
	if ($withholdingTax) $withholdingTax.textContent = "$0";
	if ($healthInsuranceTax) $healthInsuranceTax.textContent = "$0";
	if ($taxTotal) $taxTotal.textContent = "$0";
	if ($withholdingCertificate) $withholdingCertificate.textContent = "$0";
}

const toggleVisibility = (element, show) => {
    if (element) {
        if (show) {
            element.style.display = 'block';
            element.classList.remove('d-none');
            element.classList.add('d-block');
        } else {
            element.style.display = 'none';
            element.classList.remove('d-block');
            element.classList.add('d-none');
        }
    }
}

function resetTicket() {
    const isPersonal = $personalOption.checked;
    
    // 確保元素變數已初始化
    if (!$personalTicket) $personalTicket = document.getElementById("personal-landlord-ticket");
    if (!$companyTicket) $companyTicket = document.getElementById("company-landlord-ticket");
    
    // 控制房東區域的顯示/隱藏
    toggleVisibility($personalTicket, isPersonal);
    toggleVisibility($companyTicket, !isPersonal);
    
    // 控制租客區域的顯示/隱藏
    const $personalTenantDisplay = document.getElementById("personal-tenant-display");
    const $companyTenantDisplay = document.getElementById("company-tenant-display");
    toggleVisibility($personalTenantDisplay, isPersonal);
    toggleVisibility($companyTenantDisplay, !isPersonal);
    
    // 控制代扣稅額選擇區域的顯示/隱藏
    const $taxPolicySection = document.getElementById('tax-policy-section');
    if ($taxPolicySection) {
        toggleVisibility($taxPolicySection, isPersonal);
    }
    
    // 重新計算租金
    updateRentingFee();
}

function findHouseOwner(){
	return $personalOption.checked ? "personal" : "company";
}

function setCompanyRentineFee(sale, tax, total){
	const values = { sale, tax, total };

	['rent-sale', 'rent-tax', 'rent-total'].forEach( domId => {
		const $textItem = document.getElementById(`${domId}-price`);
		$textItem.textContent = `$${values[domId.replace('rent-', '')].toLocaleString()}`;
	})
}

function handleCompanyLandlord(applyMoney) {
	// 公司房東專用處理函數
	// 輸入的金額就是總額（含稅），需要計算銷售額和營業稅
	const taxFee = Math.round(applyMoney / 1.05 * 0.05);
	const saleAmount = applyMoney - taxFee;
	
	// 更新公司房東區域的顯示
	setCompanyRentineFee(saleAmount, taxFee, applyMoney);
	
	// 更新公司租客實際支付金額
	const $companyTenantPay = document.getElementById('company-tenant-actual-pay');
	if ($companyTenantPay) {
		$companyTenantPay.textContent = `$${applyMoney.toLocaleString()}`;
	}
}

function updateRentingFee(event = null){
	const whoIsHouseOwner = findHouseOwner();
	let discountMoney = 0;
	let secondGenerationHealthyMoney = 0;
	let actualPayMoney = 0;
	let wholeDiscountMoney = 0;

	let eventTargetValue = parseInt(event ? event.target.value : document.getElementById('monthly-renting-fee').value);
	if (isNaN(eventTargetValue)) {
		eventTargetValue = 0; // 如果沒有輸入值，設為0
	}
	let applyMoney = Math.max(eventTargetValue, 0);

	let displayMoney = parseInt(eventTargetValue < 0 ? 0 : eventTargetValue);
	document.getElementById('monthly-renting-fee').value = displayMoney;

	if (whoIsHouseOwner === 'company') {
		// 公司房東：完全獨立的處理區塊
		handleCompanyLandlord(applyMoney);
		return;
	}

	// 個人房東的計算邏輯
	let withholdingCertificateAmount;
	
	if (includingTax) {
		// 房東繳：扣繳憑單金額 = 實際租金金額
		withholdingCertificateAmount = applyMoney;
		
		// 計算代扣稅金（10%）- 門檻：20,010元
		if (withholdingCertificateAmount >= 20010) {
			discountMoney = withholdingCertificateAmount * discountRate;
		}
		
		// 計算二代健保（2.11%）- 門檻：20,000元
		if (withholdingCertificateAmount >= 20000) {
			secondGenerationHealthyMoney = withholdingCertificateAmount * secondGenerationHealthyMoneyRate;
		}
		
		// 總代扣稅金
		wholeDiscountMoney = Math.round(discountMoney) + Math.round(secondGenerationHealthyMoney);
		
		// 房東繳：租客實際支付 = 租金總額（含稅）
		actualPayMoney = applyMoney;
	} else {
		// 租客繳：扣繳憑單金額 = 房東要收到的金額 ÷ (1 - 12.11%)
		// 12.11% = 10% + 2.11%
		const totalTaxRate = discountRate + secondGenerationHealthyMoneyRate; // 0.1211
		// 使用無條件捨去避免浮點數誤差
		withholdingCertificateAmount = Math.floor(applyMoney / 0.8789);
		
		
		// 計算代扣稅金（10%）- 門檻：20,010元
		if (withholdingCertificateAmount >= 20010) {
			discountMoney = withholdingCertificateAmount * discountRate;
		}
		
		// 計算二代健保（2.11%）- 門檻：20,000元
		if (withholdingCertificateAmount >= 20000) {
			secondGenerationHealthyMoney = withholdingCertificateAmount * secondGenerationHealthyMoneyRate;
		}
		
		// 總代扣稅金
		wholeDiscountMoney = Math.round(discountMoney) + Math.round(secondGenerationHealthyMoney);
		
		// 租客繳：租客實際支付 = 扣繳憑單金額
		actualPayMoney = withholdingCertificateAmount;
	}
	
	const updateElementText = (element, value) => {
		if (element) {
			element.textContent = `$${Math.round(value).toLocaleString()}`;
		}
	};
	
	// 更新新的元素
	if (!$tenantActualPay) $tenantActualPay = document.getElementById('tenant-actual-pay');
	if (!$landlordActualReceive) $landlordActualReceive = document.getElementById('landlord-actual-receive');
	if (!$withholdingTax) $withholdingTax = document.getElementById('withholding-tax');
	if (!$healthInsuranceTax) $healthInsuranceTax = document.getElementById('health-insurance-tax');
	if (!$taxTotal) $taxTotal = document.getElementById('tax-total');
	if (!$withholdingCertificate) $withholdingCertificate = document.getElementById('withholding-certificate');
	
	updateElementText($tenantActualPay, actualPayMoney);
	
	// 房東實際拿到的金額計算
	let landlordReceiveAmount;
	if (includingTax) {
		// 房東繳：房東實際拿到 = 租客實際支付 - 代扣稅金
		landlordReceiveAmount = actualPayMoney - wholeDiscountMoney;
	} else {
		// 租客繳：房東實際拿到 = 原始租金金額（因為稅金由租客負擔）
		landlordReceiveAmount = applyMoney;
	}
	
	
	updateElementText($landlordActualReceive, landlordReceiveAmount);
	updateElementText($withholdingTax, discountMoney);
	updateElementText($healthInsuranceTax, secondGenerationHealthyMoney);
	updateElementText($taxTotal, wholeDiscountMoney);
	updateElementText($withholdingCertificate, withholdingCertificateAmount);
}

(function(){
	$personalOption = document.getElementById("personal-landlord");
 	$companyOption = document.getElementById("company-landlord");
 	$personalOption.addEventListener("change", () => { resetTicket() });
 	$companyOption.addEventListener("change", () => { resetTicket() });

 	$personalTicket = document.getElementById("personal-landlord-ticket");
 	$companyTicket = document.getElementById("company-landlord-ticket");

	// 新的元素ID
	$tenantActualPay = document.getElementById('tenant-actual-pay');
	$landlordActualReceive = document.getElementById('landlord-actual-receive');
	$withholdingTax = document.getElementById('withholding-tax');
	$healthInsuranceTax = document.getElementById('health-insurance-tax');
	$taxTotal = document.getElementById('tax-total');
	$withholdingCertificate = document.getElementById('withholding-certificate');

	const $taxTypes = document.querySelectorAll('[name="tax-policy"]');
	$taxTypes.forEach(($taxType) => {
	    $taxType.addEventListener('change', (e) => {
	    	includingTax = e.target.value === 'including' ? true : false;
	    	// 只有個人房東才需要重新計算
	    	if (findHouseOwner() === 'personal') {
	    		updateRentingFee();
	    	}
	    });
	});

	const $landLordTypes = document.querySelectorAll('[name="landlord"]');
	$landLordTypes.forEach(($landLordType) => {
	    $landLordType.addEventListener('change', (e) => {
	    	updateRentingFee();
	    });
	});
	
	// 頁面載入完成後初始化
	window.addEventListener('load', () => {
		resetTicket();
	});
})()