! function() {
    function e(e, t) {
        var r = {
            error: !1,
            data: e
        };
        for (var o in t) {
            if (t[o].isRequired && void 0 == e[o]) {
                r.error = o + " is required.";
                break
            }
            if (t[o].isNumber && ("number" != typeof e[o] || isNaN(e[o]))) {
                r.error = o + " must be a number.";
                break
            }
            if (t[o].isNotNegative && e[o] < 0) {
                r.error = o + " must be a positive number.";
                break
            }
            if (t[o].isNotZero && 0 == e[o]) {
                r.error = o + " must be greater then 0.";
                break
            }
            if (t[o].isNotFloat && e[o] % 1 != 0) {
                r.error = o + " must be an integer value.";
                break
            }
        }
        return r
    }

    function t(e, t) {
        return e * t
    }

    function r(e) {
        var t = e.loanAmount,
            r = 0 == e.interestRate ? 0 : e.interestRate / 100,
            o = 0 == r ? 0 : r / 12,
            i = 12 * e.termInYears;
        return o * t * Math.pow(1 + o, i) / (Math.pow(1 + o, i) - 1)
    }

    function o(e) {
        var t = e.monthlyPrincipalPayment,
            r = 0 == e.interestRate ? 0 : e.interestRate / 100,
            o = 0 == r ? 0 : r / 12,
            i = 12 * e.termInYears;
        return t * (Math.pow(1 + o, i) - 1) / (o * Math.pow(1 + o, i))
    }

    function i(e) {
        return isNaN(parseFloat(e.toFixed(2))) ? 0 : parseFloat(e.toFixed(2))
    }
    window.mortgageCalculators = {}, window.mortgageCalculators.monthlyMortgagePayments = function(t) {
        var o = e(t, {
            loanAmount: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !1
            },
            interestRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            termInYears: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            }
        });
        return o.error ? {
            error: o.error
        } : i(r(t))
    }, window.mortgageCalculators.monthlyMortgagePaymentsWithExtraPayments = function(o) {
        var a = e(o, {
            loanAmount: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !1
            },
            interestRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            termInYears: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            extraPaymentAmount: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            }
        });
        if (a.error) return {
            error: a.error
        };
        for (var s = o.interestRate / 100 / 12, n = 12 * o.termInYears, N = o.extraPaymentAmount, m = r({
                loanAmount: o.loanAmount,
                interestRate: o.interestRate,
                termInYears: o.termInYears
            }), u = o.loanAmount, l = 0, g = m, R = 0; R <= n; R++) {
            u - (c = m - (v = t(s, u))) >= 0 ? u >= g && (u -= c) : u -= g = u, u > 0 && (l += m)
        }
        var y = m + N;
        u = o.loanAmount;
        var d = [];
        for (R = 0; R <= n; R++) {
            var v, c;
            u - (c = m - (v = t(s, u)) + N) >= 0 ? u >= y && (u -= c) : u -= y = u, u > 0 && d.push({
                monthlyPayment: i(m + N),
                principalPayment: i(c),
                interestPayment: i(v),
                balance: i(u)
            })
        }
        for (var b = [], f = 0; f <= Math.ceil(d.length); f += 12) b.push(d.slice(f, f + 12));
        for (var h = [], I = o.loanAmount, F = 0; F < b.length; F++) {
            for (var P = 0, p = 0, q = 0; q < b[F].length; q++) P += b[F][q].interestPayment, p += b[F][q].principalPayment;
            I - p >= 0 ? I >= p && (I -= p) : I -= p = I, h.push({
                annualInterestPayment: i(P),
                annualPrincipalPayment: i(p),
                balance: i(I),
                monthlyBreakdown: b[F]
            })
        }
        return {
            withExtraPayment: {
                totalMonthlyPayment: i(m + N),
                interestRate: o.interestRate,
                term: o.termInYears,
                totalCost: i(d.length * (m + N)),
                payments: h
            },
            withoutExtraPayment: {
                totalMonthlyPayment: i(m),
                interestRate: o.interestRate,
                term: o.termInYears,
                totalCost: i(l)
            }
        }
    }, window.mortgageCalculators.howMuchCanIBorrow = function(t) {
        var r = e(t, {
            interestRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            termInYears: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            grossMonthlyIncome: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            downPayment: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            monthlyDebtPayment: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            yearlyPropertyTax: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            yearlyPropertyInsurance: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            }
        });
        if (r.error) return {
            error: r.error
        };
        var a = t.interestRate,
            s = t.termInYears,
            n = t.monthlyDebtPayment,
            N = t.grossMonthlyIncome,
            m = t.downPayment / 100,
            u = t.yearlyPropertyTax / 12 + t.yearlyPropertyInsurance / 12,
            l = .36,
            g = .43,
            R = o({
                termInYears: s,
                interestRate: a,
                monthlyPrincipalPayment: l * N - n - u
            }),
            y = o({
                termInYears: s,
                interestRate: a,
                monthlyPrincipalPayment: g * N - n - u
            });
        return {
            conservative: {
                priceOfHome: i(R + R * m),
                downPayment: i(R * m),
                loanAmount: i(R)
            },
            aggressive: {
                priceOfHome: i(y + y * m),
                downPayment: i(y * m),
                loanAmount: i(y)
            },
            futureMonthlyPayment: {
                conservative: {
                    principalAndInterest: i(l * N - n),
                    taxesAndInsurance: i(u),
                    totalMonthlyPayment: i(l * N - n + u)
                },
                aggressive: {
                    principalAndInterest: i(g * N - n),
                    taxesAndInsurance: i(u),
                    totalMonthlyPayment: i(g * N - n + u)
                }
            }
        }
    }, window.mortgageCalculators.compareFifteenVsThirtyYearMortgages = function(t) {
        var o = e(t, {
            loanAmount: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !1
            },
            interestRate1: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            interestRate2: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            }
        });
        if (o.error) return {
            error: o.error
        };
        var a = t.loanAmount,
            s = t.interestRate1,
            n = t.interestRate2,
            N = r({
                loanAmount: a,
                interestRate: s,
                termInYears: 15
            }),
            m = r({
                loanAmount: a,
                interestRate: n,
                termInYears: 30
            });
        return {
            fifteenYearMortgage: {
                monthlyMortgagePayment: i(N),
                totalInterest: i(15 * N * 12 - a),
                totalPayments: i(15 * N * 12)
            },
            thirtyYearMortgage: {
                monthlyMortgagePayment: i(m),
                totalInterest: i(30 * m * 12 - a),
                totalPayments: i(30 * m * 12)
            }
        }
    }, window.mortgageCalculators.refinanceMortgage = function(o) {
        var a = e(o, {
            loanAmount: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !1
            },
            interestRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            termInYears: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            newInterestRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            newTermInYears: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            newTermInYears: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            paymentsMade: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !0
            }
        });
        if (a.error) return {
            error: a.error
        };
        for (var s = o.loanAmount, n = o.interestRate, N = o.termInYears, m = o.newInterestRate, u = o.newTermInYears, l = o.paymentsMade, g = r({
                loanAmount: s,
                interestRate: n,
                termInYears: N
            }), R = s, y = 0, d = 0; d < l; d++) {
            var v = t(n / 100 / 12, R),
                c = g - v;
            R - c >= 0 && (R -= c), c, y += v
        }
        var b = g * N * 12 - s - y,
            f = R,
            h = r({
                loanAmount: f,
                interestRate: m,
                termInYears: u
            }),
            I = h * u * 12 - R;
        return {
            interestSaved: i(b - I),
            oldMonthlyMortgage: {
                monthlyMortgagePayment: i(g),
                remainingInterest: i(b)
            },
            newMonthlyMortgage: {
                newMortgageTotal: i(f),
                monthlyMortgagePayment: i(h),
                remainingInterest: i(I)
            }
        }
    }, window.mortgageCalculators.comparefixedRateVsARM = function(o) {
        var a = e(o, {
            loanAmount: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !1
            },
            interestRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            termInYears: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            monthsBeforeFirstAdjustment: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            monthsBetweenAdjustments: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            expectedAdjustmentRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            initialInterestRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            maximumInterestRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !1
            }
        });
        if (a.error) return {
            error: a.error
        };
        for (var s = o.interestRate, n = o.termInYears, N = o.loanAmount, m = o.initialInterestRate, u = o.expectedAdjustmentRate, l = o.monthsBeforeFirstAdjustment, g = o.monthsBetweenAdjustments, R = o.maximumInterestRate, y = r({
                loanAmount: N,
                interestRate: s,
                termInYears: n
            }), d = r({
                loanAmount: N,
                interestRate: m,
                termInYears: n
            }), v = N, c = 0; c < l; c++) {
            v -= d - t(m / 100 / 12, v)
        }
        for (var b = m + u, f = r({
                loanAmount: v,
                interestRate: b,
                termInYears: n - l / 12
            }), h = 0; h < g; h++) {
            v -= f - t(b / 100 / 12, v)
        }
        for (var I, F = 12 * n - l - g, P = 0; P < F; P += g) {
            b < R ? b += u : b = R, f = r({
                loanAmount: v,
                interestRate: b,
                termInYears: (F - P) / 12
            });
            for (var p = 0; p < g; p++) {
                v -= f - t(b / 100 / 12, v)
            }
            I = f
        }
        return response = {
            fixedRate: {
                monthlyMortgagePayment: i(y)
            },
            ARM: {
                initialMonthlyMortgagePayment: i(d),
                maxMonthlyMortgagePayment: i(I)
            }
        }, response
    }, window.mortgageCalculators.compareBuyVsRent = function(o) {
        var a = e(o, {
            monthlyRent: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !1
            },
            purchasePrice: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !1
            },
            downPayment: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            interestRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            termInYears: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            howLongBeforeSelling: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !0,
                isNotFloat: !0
            },
            incomeTaxRate: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            expectedAnnualRentIncrease: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            closingCosts: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            },
            annualAppreciation: {
                isRequired: !0,
                isNumber: !0,
                isNotNegative: !0,
                isNotZero: !1,
                isNotFloat: !1
            }
        });
        if (a.error) return {
            error: a.error
        };
        for (var s = o.monthlyRent, n = o.expectedAnnualRentIncrease, N = o.purchasePrice, m = o.downPayment / 100 * N, u = N - m, l = o.interestRate, g = o.termInYears, R = o.closingCosts / 100 * u, y = o.howLongBeforeSelling, d = o.incomeTaxRate, v = o.annualAppreciation, c = r({
                loanAmount: u,
                interestRate: l,
                termInYears: g
            }), b = 0, f = 0, h = 0, I = N, F = 0, P = m, p = 0; p < y; p++) {
            F += 12 * s, s += s * (n / 100), I += I * (v / 100);
            for (var q = 0; q < 12; q++) {
                var w = t(l / 100 / 12, u),
                    A = c - w;
                u - A >= 0 ? u >= A && (u -= A) : u -= A = u, f += A, b += w, h += w * (d / 100)
            }
        }
        var Z = I - u,
            M = (P += f + b - h + (u + R)) - I;
        return {
            currentValueOfHome: i(I),
            totalOwedToBank: i(u),
            equityOnHome: i(Z),
            netCostOfBuying: i(M),
            netCostOfRenting: i(F),
            benefitOfBuying: i(F - M)
        }
    }
}();