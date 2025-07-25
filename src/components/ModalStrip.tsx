// "use client";
// import React, { type FunctionComponent } from "react";
// import { useAppSelector } from "../redux/hooks";

// const ModalStrip: FunctionComponent = (props) => {
//   const { modalType, message } = useAppSelector(
//     (state) => state.uielements.modalstrip
//   );

//   return (
//     <>
//       <div
//         id="modalStripSuccess"
//         className={
//           !modalType
//             ? "modal-strip modal-centre"
//             : "modal-strip modal-top modal-active background-" + modalType
//         }
//         style={{
//           borderRadius: "10px",
//           border: "solid 1px #ffffff",
//           color: "#ffffff",

//           padding: "20px",
//           position: "fixed",
//           width: "48%",
//           display: "inline-block",
//           left: "20%",
//           margin: "150px",
//         }}
//       >
//         <div className="container">
//           <div className="text-center">{message}</div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModalStrip;
