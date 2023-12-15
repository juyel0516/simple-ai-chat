import React from "react";

// Get amount
function getPrice(subscriptions, role) {
  let price = "";
  if (subscriptions.hasOwnProperty(role)) {
    if (subscriptions[role].price == 0) {
      price = "Free";
    }
    price = "$" + subscriptions[role].price + "/month + (usage fee)";
  }
  return price;
}

const SubscriptionComparisonTable = ({ subscriptions }) => {
  const comparison = [
    { name: "GPT-4", user: "100/day", pro_user: "200/day", super_user: "300/day" },
    { name: "GPT-4V", user: "Yes", pro_user: "Yes", super_user: "Yes" },
    { name: "Fullscreen", user: "Yes", pro_user: "Yes", super_user: "Yes" },
    { name: "De-hallucination", user: "Yes", pro_user: "Yes", super_user: "Yes" },
    { name: "Role/Assistant", user: "Yes", pro_user: "Yes", super_user: "Yes" },
    { name: "Functions", user: "Yes", pro_user: "Yes", super_user: "Yes" },
    { name: "Personal Database", user: "╳", pro_user: "Yes", super_user: "Yes" },
    { name: "Midjourney", user: "╳", pro_user: "╳", super_user: "Yes" },
    { name: "Pricing", user: getPrice(subscriptions, "user"), pro_user: getPrice(subscriptions, "pro_user"), super_user: getPrice(subscriptions, "super_user")},
  ];

  return (
    <div className="mt-3">
      <div className="mb-1">
        <div>Features Comparison</div>
      </div>
      <div className="table-container">
        <table className="table-fixed">
          <thead>
            <tr>
              <th rowSpan="2">Features/Price</th>
              <th colSpan="3">Subcriptions(Roles)</th>
            </tr>
            <tr>
              <th>`user`</th>
              <th>`pro_user`</th>
              <th>`super_user`</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.user}</td>
                <td>{item.pro_user}</td>
                <td>{item.super_user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2">* For enterprise use, please contact us at `<a href="mailto:support@simple-ai.io"><u>support@simple-ai.io</u></a>`.</div>
    </div>
  );
};

export default SubscriptionComparisonTable;
