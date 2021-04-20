const liveUsersContainer = document.querySelector(".liveUsersContainer");
const counter = document.querySelector(".counter");


export default function updateUserEls(liveUsers) {
	if (liveUsers.length > 0) { // als er live users zijn
		counter.textContent = liveUsers.length;
		const correctUsers = liveUsers.filter((v,i,a) => a.findIndex(t=>(t.user === v.user))===i); // filter duplicate users
		counter.textContent = correctUsers.length;
		liveUsers.forEach(userData => {
			const existingUser = document.querySelector(`[data-userid="${userData.user}"]`);
			if (!existingUser) { // als die niet bestaat
				//const liveIndex = liveUsers.findIndex(obj => obj.user === existingUser.)
				const ElContainer = document.createElement("div");
				ElContainer.classList.add("userContainer");
				ElContainer.dataset.userid = userData.user;
				const userTitle = document.createElement("h3");
				const visitedPagesUl = document.createElement("ul");
				userData.visitedPages.forEach(page => {
					const liHtml = document.createElement("li");
					liHtml.textContent = page;
					visitedPagesUl.append(liHtml);
				})
				userTitle.textContent = userData.user;
				ElContainer.append(userTitle);
				ElContainer.append(visitedPagesUl);
				liveUsersContainer.append(ElContainer);
			} else {
				const liveIndex = liveUsers.findIndex(obj => obj.user === existingUser.dataset.userid);
				if (liveIndex != -1) {
					const visitedPagesList = existingUser.querySelector("ul");
					visitedPagesList.innerHTML = "";
					userData.visitedPages.forEach(page => {
						const liHtml = document.createElement("li");
						liHtml.textContent = page;
						visitedPagesList.append(liHtml);
					})
				} else {
					existingUser.remove();
				}
			}
		})

		const allUserElements = document.querySelectorAll(".userContainer");
		allUserElements.forEach(el => {
			const elLiveIndex = liveUsers.findIndex(obj => obj.user === el.dataset.userid)
			if (elLiveIndex === -1) {
				el.remove()
			}
		})
	} else {
		liveUsersContainer.innerHTML = "";
		counter.textContent = 0;
	}
}