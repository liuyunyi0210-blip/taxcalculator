// 整合版稅務計算工具 JavaScript 功能

// 全域變數
let currentTool = 'labor-health';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeTools();
});

// 側邊選單功能
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    // 側邊選單切換（僅手機版）
    sidebarToggle.addEventListener('click', function() {
        // 只有在手機版時才允許切換
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    });
    
    // 點擊主內容區域時關閉側邊選單（僅手機版）
    mainContent.addEventListener('click', function(e) {
        // 只有在手機版且點擊的不是選單按鈕時才關閉
        if (window.innerWidth <= 768 && !e.target.closest('.sidebar-toggle')) {
            sidebar.classList.add('collapsed');
            mainContent.classList.remove('expanded');
        }
    });
    
    // 視窗大小改變時的處理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // 桌面版：強制顯示選單，不允許隱藏
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        } else {
            // 手機版：預設隱藏選單
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    });
}

// 工具切換功能
function switchTool(toolName) {
    // 隱藏所有工具
    const toolContainers = document.querySelectorAll('.tool-container');
    toolContainers.forEach(container => {
        container.style.display = 'none';
    });
    
    // 移除所有選單項目的 active 狀態
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 顯示選中的工具
    const targetTool = document.getElementById(toolName + '-tool');
    if (targetTool) {
        targetTool.style.display = 'block';
    }
    
    // 設定選中的選單項目為 active
    const targetMenuItem = document.querySelector(`[data-tool="${toolName}"]`);
    if (targetMenuItem) {
        targetMenuItem.classList.add('active');
    }
    
    // 更新當前工具
    currentTool = toolName;
    
    // 在手機版上關閉側邊選單
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        sidebar.classList.add('collapsed');
        mainContent.classList.remove('expanded');
    }
    
    // 當切換到勞健保工具時，初始化下拉選單
    if (toolName === 'labor-health' && window.initCustomSelect) {
        setTimeout(function() {
            const select = document.getElementById('take-care-people');
            if (select && select.dataset.customSelectInitialized !== 'true') {
                window.initCustomSelect('take-care-people');
            }
        }, 50);
    }
    
    // 當切換到發票工具時，初始化下拉選單
    if (toolName === 'invoice' && window.initCustomSelect) {
        setTimeout(function() {
            const select = document.getElementById('tax-rate');
            if (select && select.dataset.customSelectInitialized !== 'true') {
                window.initCustomSelect('tax-rate');
            }
        }, 50);
    }
}

// 初始化所有工具
function initializeTools() {
    initializeLaborHealthTool();
    initializeInvoiceTool();
    initializeRentTaxTool();
}

// 勞健保分攤估算工具初始化
function initializeLaborHealthTool() {
    // 這裡會使用原本的勞健保計算邏輯
    // 由於原本的 JavaScript 檔案已經包含了所有功能
    // 我們只需要確保事件監聽器正確綁定
    
    // 初始化扶養眷屬自訂下拉選單
    // 使用 setTimeout 確保所有腳本都已載入且元素已存在
    setTimeout(function() {
        if (window.initCustomSelect) {
            window.initCustomSelect('take-care-people');
        }
    }, 50);
    
    console.log('勞健保分攤估算工具已初始化');
}

// 開立發票模擬工具初始化
function initializeInvoiceTool() {
    // 發票類型切換
    const invoiceRadios = document.querySelectorAll('input[name="invoice"]');
    invoiceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const step2 = document.getElementById('invoice-step-2');
            if (this.value === 'company') {
                step2.classList.remove('d-none');
            } else {
                step2.classList.add('d-none');
            }
            
            // 切換發票預覽
            const twoSectionInvoice = document.getElementById('two-section-invoice');
            const threeSectionInvoice = document.getElementById('three-section-invoice');
            
            if (this.value === 'company') {
                twoSectionInvoice.classList.add('d-none');
                threeSectionInvoice.classList.remove('d-none');
            } else {
                twoSectionInvoice.classList.remove('d-none');
                threeSectionInvoice.classList.add('d-none');
            }
        });
    });
    
    console.log('開立發票模擬工具已初始化');
}

// 租金扣繳稅金&二健估算工具初始化
function initializeRentTaxTool() {
    // 房東類型切換
    const landlordRadios = document.querySelectorAll('input[name="landlord"]');
    landlordRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const personalTicket = document.getElementById('personal-landlord-ticket');
            const companyTicket = document.getElementById('company-landlord-ticket');
            
            if (this.value === 'personal') {
                personalTicket.classList.remove('d-none');
                companyTicket.classList.add('d-none');
            } else {
                personalTicket.classList.add('d-none');
                companyTicket.classList.remove('d-none');
            }
        });
    });
    
    console.log('租金扣繳稅金&二健估算工具已初始化');
}

// 工具切換的快捷鍵
document.addEventListener('keydown', function(e) {
    // Ctrl + 1: 勞健保分攤估算
    if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        switchTool('labor-health');
    }
    // Ctrl + 2: 開立發票模擬
    else if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        switchTool('invoice');
    }
    // Ctrl + 3: 租金扣繳稅金&二健估算
    else if (e.ctrlKey && e.key === '3') {
        e.preventDefault();
        switchTool('rent-tax');
    }
    // ESC: 關閉側邊選單（手機版）
    else if (e.key === 'Escape' && window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        sidebar.classList.add('collapsed');
        mainContent.classList.remove('expanded');
    }
});

// 防止選單連結的預設行為
document.addEventListener('click', function(e) {
    if (e.target.closest('.menu-item a')) {
        e.preventDefault();
    }
});

// 工具切換動畫效果
function animateToolSwitch() {
    const toolContainers = document.querySelectorAll('.tool-container');
    toolContainers.forEach(container => {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    });
}

// 響應式處理
function handleResponsive() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (window.innerWidth <= 768) {
        // 手機版：預設關閉側邊選單
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else {
        // 桌面版：顯示側邊選單
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
}

// 視窗大小改變時重新處理響應式
window.addEventListener('resize', handleResponsive);

// 頁面載入時處理響應式
window.addEventListener('load', handleResponsive);

// ============================================
// 自訂下拉選單功能（通用函數）
// ============================================

// 更新自訂下拉選單顯示文字
function updateCustomSelectDisplay(selectId, value) {
    const button = document.getElementById(`${selectId}-button`);
    if (!button) return;
    
    const textSpan = button.querySelector('.custom-select-text');
    const options = document.querySelectorAll(`#${selectId}-options .custom-select-option`);
    
    // 移除所有選中狀態
    options.forEach(option => option.classList.remove('selected'));
    
    // 找到對應的選項並更新顯示
    options.forEach(option => {
        if (option.getAttribute('data-value') === value) {
            if (textSpan) textSpan.textContent = option.textContent;
            option.classList.add('selected');
        }
    });
}

// 初始化自訂下拉選單（通用版本）
function initCustomSelect(selectId) {
    const select = document.getElementById(selectId);
    const button = document.getElementById(`${selectId}-button`);
    const options = document.getElementById(`${selectId}-options`);
    
    if (!select || !button || !options) {
        console.warn(`自訂下拉選單初始化失敗：找不到元素 (${selectId})`);
        return;
    }
    
    // 如果已經初始化過，先移除舊的事件監聽器（避免重複綁定）
    if (select.dataset.customSelectInitialized === 'true') {
        return;
    }
    select.dataset.customSelectInitialized = 'true';
    
    const optionElements = options.querySelectorAll('.custom-select-option');
    
    // 初始化顯示當前選中的值
    const currentValue = select.value;
    updateCustomSelectDisplay(selectId, currentValue);
    
    // 按鈕點擊事件：展開/收起選單
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = options.classList.contains('show');
        
        // 關閉所有其他下拉選單
        document.querySelectorAll('.custom-select-options.show').forEach(opt => {
            if (opt !== options) {
                opt.classList.remove('show');
                const wrapper = opt.closest('.custom-select-wrapper');
                if (wrapper) {
                    const otherButton = wrapper.querySelector('.custom-select-button');
                    if (otherButton) otherButton.classList.remove('open');
                }
            }
        });
        
        // 切換當前選單
        if (isOpen) {
            options.classList.remove('show');
            button.classList.remove('open');
        } else {
            options.classList.add('show');
            button.classList.add('open');
        }
    });
    
    // 選項點擊事件
    optionElements.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            select.value = value;
            
            // 觸發 change 事件（讓原有的監聽器能正常工作）
            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
            
            // 更新顯示
            updateCustomSelectDisplay(selectId, value);
            
            // 關閉選單
            options.classList.remove('show');
            button.classList.remove('open');
        });
    });
    
    // 點擊外部關閉選單
    document.addEventListener('click', function(e) {
        if (!button.contains(e.target) && !options.contains(e.target)) {
            options.classList.remove('show');
            button.classList.remove('open');
        }
    });
    
    // 監聽原生 select 的 change 事件（以防有其他方式改變值）
    select.addEventListener('change', function() {
        updateCustomSelectDisplay(selectId, this.value);
    });
}

// 導出函數供其他腳本使用
window.switchTool = switchTool;
window.animateToolSwitch = animateToolSwitch;
window.initCustomSelect = initCustomSelect;
window.updateCustomSelectDisplay = updateCustomSelectDisplay;
