// script.js
window.onload = function() {
    loadDonationModal(); // 페이지 로드 시 모달 표시
};

function loadDonationModal() {
    fetch('donation.html')
        .then(response => response.text())
        .then(data => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = data;
            document.body.appendChild(modal); // 모달을 body에 추가

            modal.style.display = 'block'; // 페이지 로드 시 모달 표시

            // 모달 닫기 기능
            const span = modal.getElementsByClassName('close')[0];
            span.onclick = function() {
                modal.style.display = 'none';
            };
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            };
        })
        .catch(error => console.error('Error loading donation modal:', error));
}
