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
    
    // 側邊選單切換
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });
    
    // 點擊主內容區域時關閉側邊選單（手機版）
    mainContent.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            mainContent.classList.remove('expanded');
        }
    });
    
    // 視窗大小改變時的處理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
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

// 導出函數供其他腳本使用
window.switchTool = switchTool;
window.animateToolSwitch = animateToolSwitch;
