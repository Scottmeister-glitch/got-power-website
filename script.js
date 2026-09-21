const m=document.querySelector(".menu"),n=document.querySelector("nav");m.onclick=()=>n.classList.toggle("open");document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>n.classList.remove("open"));

const form=document.querySelector("#form"),statusMessage=document.querySelector("#status"),submitButton=form.querySelector("button[type=submit]");
form.onsubmit=async e=>{
  e.preventDefault();
  submitButton.disabled=true;
  submitButton.textContent="SENDING...";
  statusMessage.className="";
  statusMessage.textContent="Sending your request...";

  try{
    const response=await fetch(form.action.replace("formsubmit.co/","formsubmit.co/ajax/"),{
      method:"POST",
      body:new FormData(form),
      headers:{Accept:"application/json"}
    });
    const result=await response.json();
    if(!response.ok||!(result.success===true||result.success==="true"))throw new Error("Submission failed");

    form.reset();
    statusMessage.className="success";
    statusMessage.textContent="Thank you. Your service request was sent successfully.";
  }catch(error){
    statusMessage.className="error";
    statusMessage.textContent="We couldn't send your request. Please try again or call (707) 655-5981.";
  }finally{
    submitButton.disabled=false;
    submitButton.textContent="SEND REQUEST";
  }
};
